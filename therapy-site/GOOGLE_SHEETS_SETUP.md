# Google Sheets Form Setup

Use this when connecting the appointment form to Google Sheets.

## Sheet

Target sheet:

`https://docs.google.com/spreadsheets/d/1k8vLoBumAOsdCOVc8MhMqgPl7VT7N-XIK9_KlcnfNiM/edit`

The script will create this header row if the sheet is empty:

`Timestamp`, `Name`, `Phone`, `Preferred Support`, `Message`, `Source Page`

## Apps Script

1. Open the Google Sheet.
2. Go to `Extensions` > `Apps Script`.
3. Paste the contents of `google-apps-script.gs`.
4. Check that `SHEET_NAME` matches the tab name in the sheet. It is currently set to `Sheet1`.
5. Click `Deploy` > `New deployment`.
6. Choose type: `Web app`.
7. Execute as: `Me`.
8. Who has access: `Anyone`.
9. Deploy and copy the Web App URL ending in `/exec`.

## Website

Paste the Web App URL into the form in `index.html`:

```html
<form class="contact-form" action="#" method="post" data-endpoint="PASTE_WEB_APP_URL_HERE">
```

## Safety Included

- Required fields
- Phone format validation
- Maximum length limits
- Hidden honeypot field
- Client-side one-submit-per-minute throttle
- Server-side duplicate/rate-limit check for the same name and phone
- Google Sheets formula injection protection
- Basic HTML/control-character sanitization

Google Apps Script does not reliably expose the visitor IP address, so this is not true IP-based rate limiting. For IP-based protection, put a backend such as Cloudflare Worker, Netlify Function, or Vercel Function between the website and Google Sheets.
