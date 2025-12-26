# Automated Newsletter Setup with Listmonk

This guide will help you set up an automated weekly newsletter using Listmonk (open-source) and Claude API.

## What Gets Automated

- **Content Generation**: Claude API writes the newsletter content based on new tools, popular comparisons, and featured tools
- **HTML Formatting**: Markdown is converted to a beautiful HTML newsletter
- **Email Sending**: Listmonk sends to all subscribers
- **Scheduling**: GitHub Actions runs it automatically every Friday

## Prerequisites

- Claude API key (you already have this)
- A server to host Listmonk (DigitalOcean, Hetzner, Railway, etc.)
- Domain name (optional, but recommended)

---

## Part 1: Install Listmonk

### Option A: Docker (Recommended)

The easiest way to run Listmonk is with Docker.

```bash
# Create directory
mkdir listmonk && cd listmonk

# Download docker-compose.yml
wget https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml

# Generate config
docker-compose up -d db
docker-compose run --rm app ./listmonk --install

# Start Listmonk
docker-compose up -d
```

Listmonk will be available at `http://your-server-ip:9000`

### Option B: Railway (1-Click Deploy)

1. Go to https://railway.app
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Search for "listmonk" templates
5. Click deploy

Railway will give you a URL like `https://listmonk-production-xxxx.up.railway.app`

### Option C: Manual Installation

See: https://listmonk.app/docs/installation/

---

## Part 2: Configure Listmonk

1. **Access Listmonk Dashboard**
   - Open `http://your-server-ip:9000` (or your Railway URL)
   - Default login: `listmonk` / `listmonk`
   - **Change this immediately!**

2. **Create a List**
   - Go to Lists → New List
   - Name: "TechieSpiral Newsletter"
   - Type: "Public"
   - Note the List ID (usually 1 for your first list)

3. **Configure SMTP Settings**
   Go to Settings → SMTP

   **Using SendGrid (Free tier: 100 emails/day):**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: YOUR_SENDGRID_API_KEY
   ```

   **Using Mailgun:**
   ```
   Host: smtp.mailgun.org
   Port: 587
   Username: YOUR_MAILGUN_USERNAME
   Password: YOUR_MAILGUN_PASSWORD
   ```

   **Using AWS SES:**
   ```
   Host: email-smtp.us-east-1.amazonaws.com
   Port: 587
   Username: YOUR_SES_USERNAME
   Password: YOUR_SES_PASSWORD
   ```

4. **Test Email**
   - Settings → SMTP → Send Test Email
   - Make sure it works before proceeding

---

## Part 3: Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

```
LISTMONK_URL=https://your-listmonk-instance.com
LISTMONK_USER=your-admin-username
LISTMONK_PASSWORD=your-admin-password
LISTMONK_LIST_IDS=1
TEST_EMAILS=your-email@example.com (optional)
```

**You already have these:**
- `ANTHROPIC_API_KEY` ✓
- `NETLIFY_BUILD_HOOK` ✓

---

## Part 4: Install Node Dependency

```bash
cd react-techiespiral
npm install marked
```

This is needed to convert markdown to HTML for the newsletter.

---

## Part 5: Test Locally

Before automating, test the newsletter generation:

```bash
# Set environment variables
export ANTHROPIC_API_KEY=your-key
export LISTMONK_URL=https://your-listmonk.com
export LISTMONK_USER=admin
export LISTMONK_PASSWORD=your-password
export LISTMONK_LIST_IDS=1
export TEST_EMAILS=your-email@example.com

# Generate newsletter (won't send)
node scripts/generate-newsletter.js

# Check the output
cat newsletter-output/newsletter-*.md
```

You should see a generated newsletter in `newsletter-output/`

---

## Part 6: Test Sending

Once you're happy with the generated content:

```bash
# This will generate AND send
node scripts/send-newsletter.js
```

Check your inbox (the TEST_EMAILS address) to see the newsletter!

---

## Part 7: Enable Automation

The GitHub Action is already set up! It will run every **Friday at 10am UTC**.

To trigger manually:
1. Go to Actions tab in GitHub
2. Click "Send Weekly Newsletter"
3. Click "Run workflow"

---

## Customization

### Change Newsletter Schedule

Edit `.github/workflows/send-newsletter.yml`:

```yaml
schedule:
  - cron: '0 10 * * 5'  # Friday 10am UTC
```

Change to:
- `'0 14 * * 1'` - Monday 2pm UTC
- `'0 9 1 * *'` - 1st of month 9am UTC

### Customize Newsletter Content

Edit `scripts/templates/newsletter-prompt.txt` to change:
- Sections included
- Tone and style
- Length
- Structure

### Customize Email Design

Edit the `createHtmlTemplate()` function in `scripts/generate-newsletter.js` to change:
- Colors
- Layout
- Branding
- Footer content

---

## Free SMTP Options

### SendGrid
- **Free tier**: 100 emails/day
- Best for: Starting out
- Signup: https://sendgrid.com

### Mailgun
- **Free tier**: 5,000 emails/month for 3 months
- Best for: Growing list
- Signup: https://mailgun.com

### AWS SES
- **Free tier**: 62,000 emails/month (if sending from EC2)
- Best for: Scaling
- More complex setup
- Signup: https://aws.amazon.com/ses

### Postmark
- **Free trial**: 100 emails
- **Paid**: $10/month for 10,000 emails
- Best for: High deliverability
- Signup: https://postmarkapp.com

---

## Subscriber Collection

### Add Signup Form to Your Site

Listmonk provides embeddable forms:

1. Go to Lists → Your List → Form
2. Copy the HTML code
3. Add to your site (e.g., in `NewsletterSignup` component)

### Example Integration

```tsx
// src/components/NewsletterSignup.tsx
<form action="https://your-listmonk.com/subscription/form" method="post">
  <input type="email" name="email" placeholder="Enter your email" required />
  <input type="hidden" name="l" value="YOUR_LIST_UUID" />
  <button type="submit">Subscribe</button>
</form>
```

---

## Monitoring & Analytics

### View Stats in Listmonk

- Dashboard → Campaigns
- Click on any sent campaign
- See opens, clicks, bounces, unsubscribes

### Export Data

- Subscribers → Export
- Download CSV of all subscribers

---

## Cost Breakdown

### Listmonk Hosting
- **Railway**: $5/month (hobby plan)
- **DigitalOcean**: $6/month (smallest droplet)
- **Hetzner**: $4/month (CX11)

### SMTP Sending
- **SendGrid**: Free (100/day)
- **Mailgun**: Free (5K/month for 3 months)
- **AWS SES**: Free (62K/month from EC2)

### Total
- **First 3 months**: $5-6/month
- **After (if you upgrade SMTP)**: $15-20/month for 10K emails

---

## Troubleshooting

### Newsletter Not Generating

Check GitHub Actions logs:
1. Go to Actions tab
2. Click latest workflow run
3. Check "Generate and send newsletter" step

Common issues:
- Missing `ANTHROPIC_API_KEY`
- Not enough tools in database
- `marked` package not installed

### Newsletter Not Sending

Check Listmonk logs:
```bash
docker-compose logs app
```

Common issues:
- Wrong SMTP credentials
- SMTP port blocked by firewall
- From email not verified

### Test Listmonk Connection

```bash
curl -u 'username:password' \
  https://your-listmonk.com/api/lists
```

Should return JSON with your lists.

---

## Next Steps

1. ✅ Install Listmonk on a server
2. ✅ Configure SMTP provider
3. ✅ Add GitHub secrets
4. ✅ Run `npm install marked`
5. ✅ Test locally with `node scripts/generate-newsletter.js`
6. ✅ Test sending with `node scripts/send-newsletter.js`
7. ✅ Add newsletter signup form to your site
8. ✅ Let it run automatically every Friday!

---

## Support

**Listmonk Docs**: https://listmonk.app/docs
**Listmonk GitHub**: https://github.com/knadh/listmonk
**Claude API Docs**: https://docs.anthropic.com

Questions? Check the Listmonk community forum or GitHub issues.
