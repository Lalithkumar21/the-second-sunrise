# The Phoenix Sunrise

Static website for The Phoenix Sunrise, a rehabilitation psychology practice by Shalini Kumar.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Google Apps Script for Google Sheets form submissions

## Local Preview

From the repository root:

```sh
cd therapy-site
python3 -m http.server 8080
```

Then open:

`http://localhost:8080`

## Deployment

Recommended hosting: Netlify.

See [DEPLOYMENT.md](DEPLOYMENT.md).

## Form Setup

The appointment form posts to a Google Apps Script Web App, which writes to Google Sheets.

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).
