# Ero

Ero is a web-scraper and notifier. Currently configured to scrape swedish electronics websites for graphics cards and notify when new products are in store.

## Setup

### Prerequisites

- **nodejs** installed

### Get started

How to run ero:

1. Create `.env` file with database credentials:
   - `MONGO_URL` // Full mongoDB url.
   - `EMAIL_HOST`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ERROR_LOG_EMAIL_ADDRESS` // Email to send error logs to
   - `TELEGRAM_CHAT` // Chat id
   - `TELEGRAM_BOT_API_KEY` // Bot key
   - `CHROMIUM_PATH` // Only if hosted on linux
   - `UPDATE_INTERVAL_MIN` // Interval for ero to scrape retailers (in minutes)
2. Run `npm run start ero-graphics`

## Test

Run tests with

`npm run test [file_name]`
