import { generateNewsletter } from './generate-newsletter.js';
import { ListmonkClient } from './lib/listmonk-client.js';

async function sendNewsletter() {
  // Environment variables
  const listmonkUrl = process.env.LISTMONK_URL;
  const listmonkUser = process.env.LISTMONK_USER;
  const listmonkPassword = process.env.LISTMONK_PASSWORD;
  const listIds = process.env.LISTMONK_LIST_IDS?.split(',').map(Number) || [1]; // Default to list ID 1
  const testEmails = process.env.TEST_EMAILS?.split(',').filter(e => e.trim()); // Optional, filter empty strings

  if (!listmonkUrl || !listmonkUser || !listmonkPassword) {
    console.error('❌ Missing required environment variables:');
    console.error('   LISTMONK_URL - Your Listmonk instance URL');
    console.error('   LISTMONK_USER - Listmonk admin username');
    console.error('   LISTMONK_PASSWORD - Listmonk admin password');
    console.error('   LISTMONK_LIST_IDS - Comma-separated list IDs (optional, defaults to 1)');
    console.error('   TEST_EMAILS - Comma-separated test emails (optional)');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting automated newsletter process...\n');

    // Step 1: Generate newsletter content with Claude
    console.log('Step 1: Generating newsletter content...');
    const newsletter = await generateNewsletter();

    console.log('\n' + '='.repeat(60));
    console.log('📧 NEWSLETTER PREVIEW');
    console.log('='.repeat(60));
    console.log(`Subject: ${newsletter.subject}`);
    console.log('Content (first 300 chars):');
    console.log(newsletter.markdown.substring(0, 300) + '...');
    console.log('='.repeat(60) + '\n');

    // Validate generated content before attempting to send
    if (!newsletter.subject || newsletter.subject.trim().length < 5) {
      throw new Error(`Invalid newsletter subject: "${newsletter.subject}"`);
    }
    if (!newsletter.html || newsletter.html.trim().length < 200) {
      throw new Error(`Invalid newsletter HTML: too short (${newsletter.html?.length ?? 0} chars)`);
    }

    // Step 2: Send via Listmonk
    console.log('Step 2: Sending via Listmonk...');
    const listmonk = new ListmonkClient(listmonkUrl, listmonkUser, listmonkPassword);

    const campaign = await listmonk.sendNewsletter({
      subject: newsletter.subject,
      html: newsletter.html,
      listIds: listIds,
      name: `Weekly Newsletter - ${new Date().toISOString().split('T')[0]}`,
      testEmails: testEmails
    });

    console.log('\n✅ Newsletter sent successfully!');
    console.log(`   Campaign ID: ${campaign.id}`);
    console.log(`   Campaign Name: ${campaign.name}`);
    console.log(`   Lists: ${listIds.join(', ')}`);

    if (testEmails) {
      console.log(`\n⚠️  Note: Test emails sent to: ${testEmails.join(', ')}`);
      console.log(`   The campaign is now running and will send to all subscribers.`);
    }

  } catch (error) {
    console.error('\n❌ Error sending newsletter:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sendNewsletter();
}

export { sendNewsletter };
