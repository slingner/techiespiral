/**
 * Listmonk API Client
 * Docs: https://listmonk.app/docs/apis/
 */
export class ListmonkClient {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.auth = Buffer.from(`${username}:${password}`).toString('base64');
  }

  async fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async request(endpoint, options = {}, retries = 3) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, { ...options, headers });

        if (!response.ok) {
          const errorText = await response.text();
          // Don't retry client errors (4xx) - only server/network errors
          if (response.status >= 400 && response.status < 500) {
            throw new Error(`Listmonk API error: ${response.status} - ${errorText}`);
          }
          throw new Error(`Listmonk server error: ${response.status} - ${errorText}`);
        }

        return response.json();
      } catch (err) {
        lastError = err;
        // Don't retry on client errors
        if (err.message.startsWith('Listmonk API error:')) throw err;

        if (attempt < retries) {
          const delay = 2 ** attempt * 1000; // 2s, 4s, 8s
          console.warn(`⚠️  Attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    throw new Error(`Failed after ${retries} attempts: ${lastError.message}`);
  }

  /**
   * Get all lists
   */
  async getLists() {
    return this.request('/lists');
  }

  /**
   * Create a new campaign
   * @param {Object} campaign
   * @param {string} campaign.name - Campaign name
   * @param {string} campaign.subject - Email subject
   * @param {number[]} campaign.lists - Array of list IDs
   * @param {string} campaign.content_type - 'html' or 'plain'
   * @param {string} campaign.body - Email body (HTML or plain text)
   * @param {string} campaign.type - 'regular' or 'optin'
   * @param {string} campaign.send_at - ISO date string (optional, for scheduled)
   */
  async createCampaign(campaign) {
    const payload = {
      name: campaign.name,
      subject: campaign.subject,
      lists: campaign.lists,
      type: campaign.type || 'regular',
      content_type: campaign.content_type || 'html',
      body: campaign.body,
      send_at: campaign.send_at || null,
      messenger: 'email'
    };

    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Update campaign status
   * @param {number} campaignId
   * @param {string} status - 'draft', 'scheduled', 'running', 'paused', 'cancelled'
   */
  async updateCampaignStatus(campaignId, status) {
    return this.request(`/campaigns/${campaignId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Send a test email
   * @param {number} campaignId
   * @param {string[]} subscribers - Array of email addresses
   */
  async sendTestEmail(campaignId, subscribers) {
    return this.request(`/campaigns/${campaignId}/test`, {
      method: 'POST',
      body: JSON.stringify({ subscribers })
    });
  }

  /**
   * Get campaign stats
   */
  async getCampaignStats(campaignId) {
    return this.request(`/campaigns/${campaignId}`);
  }

  /**
   * Create and send a newsletter campaign
   * Helper method that combines create + send
   */
  async sendNewsletter({ subject, html, listIds, name, sendAt = null, testEmails = null }) {
    console.log(`📧 Creating campaign: ${name}`);

    // Create campaign
    const campaign = await this.createCampaign({
      name: name || `Newsletter - ${new Date().toISOString().split('T')[0]}`,
      subject,
      lists: listIds,
      content_type: 'html',
      body: html,
      type: 'regular',
      send_at: sendAt
    });

    console.log(`✅ Campaign created with ID: ${campaign.data.id}`);

    // Send test emails if provided
    if (testEmails && testEmails.length > 0) {
      console.log(`📤 Sending test emails to: ${testEmails.join(', ')}`);
      await this.sendTestEmail(campaign.data.id, testEmails);
      console.log(`✅ Test emails sent`);
    }

    // Start campaign (or schedule it)
    if (!sendAt) {
      console.log(`🚀 Starting campaign...`);
      await this.updateCampaignStatus(campaign.data.id, 'running');
      console.log(`✅ Campaign started!`);
    } else {
      console.log(`📅 Campaign scheduled for: ${sendAt}`);
      await this.updateCampaignStatus(campaign.data.id, 'scheduled');
    }

    return campaign.data;
  }
}
