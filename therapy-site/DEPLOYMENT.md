# Deployment Guide

This site is a static website. It does not need a backend server to host the pages.

## Recommended Hosting

Use Netlify for the first launch.

Why:

- Free tier is enough for this site.
- Easy custom domain setup.
- HTTPS is automatic.
- Works well with static HTML/CSS/JS.

## Option 1: Netlify Drag-and-Drop

Fastest way to make it live.

1. Go to `https://app.netlify.com/drop`.
2. Drag the `therapy-site` folder into Netlify.
3. Netlify will create a temporary live URL.
4. Test the website and form.
5. After buying the domain, connect it in Netlify under `Domain management`.

Use this option if you want to launch quickly without GitHub.

## Option 2: Netlify With GitHub

Better long-term option.

1. Push this project to GitHub.
2. In Netlify, choose `Add new site` > `Import an existing project`.
3. Select the GitHub repo.
4. Use these build settings:
   - Build command: leave empty
   - Publish directory: `therapy-site`
5. Deploy.

The root `netlify.toml` file already sets the publish directory and headers.

## Domain Setup

After buying the domain, add it in Netlify:

1. Netlify site dashboard > `Domain management`.
2. Add custom domain, for example `thesecondsunrise.com`.
3. Netlify will show DNS records.
4. In GoDaddy, update either:
   - Nameservers to Netlify nameservers, or
   - DNS records provided by Netlify.

Nameserver method is usually easier.

## Form / Google Sheets

The appointment form is already connected to the Google Apps Script Web App URL in `index.html`.

After deployment:

1. Submit a test form from the live Netlify URL.
2. Confirm a new row appears in the Google Sheet.
3. If the Apps Script blocks the new live domain, redeploy the Apps Script as:
   - Execute as: `Me`
   - Who has access: `Anyone`

## Pre-Launch Checklist

- Confirm phone number.
- Confirm email ID.
- Confirm Google Sheet receives form submissions.
- Confirm profile image loads on mobile and desktop.
- Confirm domain spelling.
- Enable HTTPS in Netlify. It is usually automatic.
