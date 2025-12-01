# Supabase Edge Function & Webhook Setup Guide

This guide documents the setup for the `update-section-json` Edge Function, which automates the process of updating JSON data files in Supabase Storage and triggering deployments whenever database content changes.

## System Overview

1.  **Database Change**: A change (INSERT, UPDATE, DELETE) occurs in a Supabase table (e.g., `projects`, `bio`).
2.  **Webhook Trigger**: A Database Webhook triggers the `update-section-json` Edge Function.
3.  **Edge Function Execution**:
    *   Fetches fresh data from the relevant table.
    *   Formats the data into JSON.
    *   Uploads the JSON file to Supabase Storage (`portfolio-json` bucket).
    *   (Optional) Triggers a GitHub Repository Dispatch to start a new build/deployment.
4.  **Frontend Update**:
    *   **Production**: The GitHub Action rebuilds the site with the new JSON data.
    *   **Local Dev**: The `auto-sync-json.js` script polls Supabase Storage and updates local `public/data/*.json` files.

---

## 1. Edge Function Setup (`update-section-json`)

The edge function is located in `supabase/functions/update-section-json`.

### Prerequisites

*   Supabase CLI installed.
*   Docker running (for local testing).
*   Logged in to Supabase CLI (`supabase login`).

### Environment Variables

The Edge Function requires the following secrets to be set in your Supabase project:

| Variable | Description |
| :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (for bypassing RLS and accessing Storage). |
| `STORAGE_BUCKET` | Name of the storage bucket (default: `portfolio-json`). |
| `WEBHOOK_SECRET` | A secret string to validate incoming webhook requests. |
| `GITHUB_REPO` | (Optional) GitHub repository in `owner/repo` format (e.g., `username/portfolio`). |
| `GITHUB_TOKEN` | (Optional) GitHub Personal Access Token with `repo` scope for triggering actions. |

To set these secrets:

```bash
supabase secrets set --env-file .env.production
# OR individually
supabase secrets set WEBHOOK_SECRET=your-secret-here
```

### Generating a Webhook Secret

You can generate a secure random secret using one of the following methods:

**Option 1: Using Terminal (openssl)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3: Online Generator**
Use a password generator to create a long, random string (30+ characters).

Copy the generated string and use it as your `WEBHOOK_SECRET`.

https://www.uuidgenerator.net/guid

### Deployment

Deploy the function to Supabase:

```bash
supabase functions deploy update-section-json --no-verify-jwt
```

> **Note**: `--no-verify-jwt` is used because we are validating the `x-webhook-secret` header manually, and the webhook comes from the database trigger which doesn't sign requests with a user JWT.

---

## 2. Storage Setup

1.  Go to **Storage** in the Supabase Dashboard.
2.  Create a new public bucket named `portfolio-json`.
3.  Ensure the bucket is **Public**.
4.  Add a policy to allow the Service Role to upload/overwrite files (usually enabled by default for Service Role).

---

## 3. Webhook Creation (Step-by-Step)

You need to create Database Webhooks to trigger the Edge Function whenever relevant tables change.

### Method A: SQL (Recommended)

Run the following SQL in the Supabase SQL Editor to create a trigger for a specific table (e.g., `projects`). Repeat for other tables or create a consolidated trigger.

```sql
-- Create a generic trigger function if it doesn't exist
-- Note: Supabase now supports calling Edge Functions directly via net extension or webhooks.
-- The easiest way is via the Dashboard, but here is the logic.

-- It is recommended to use the Supabase Dashboard for creating Webhooks as it handles the configuration easily.
```

### Method B: Supabase Dashboard (UI)

1.  Go to **Database** -> **Webhooks** in the Supabase Dashboard.
2.  Click **Create a new webhook**.
3.  **Name**: `update-json-projects` (or similar).
4.  **Table**: Select the table to watch (e.g., `projects`).
5.  **Events**: Check `INSERT`, `UPDATE`, `DELETE`.
6.  **Type**: Select **HTTP Request**.
7.  **HTTP Request Configuration**:
    *   **Method**: `POST`
    *   **URL**: `https://<project-ref>.supabase.co/functions/v1/update-section-json`
    *   **Timeout**: `1000` (default is fine).
    *   **HTTP Headers**:
        *   Add new header: `x-webhook-secret` = `your-configured-webhook-secret`
        *   Add new header: `Content-Type` = `application/json`
8.  **Payload**:
    *   The default payload sends the record info. The Edge Function looks for `table` in the payload or you can customize the body.
    *   **Recommended Body**: Customize the body to send the table name explicitly if needed, or rely on the function's mapping.
    *   To be safe, you can send a custom JSON body:
        ```json
        {
          "type": "INSERT",
          "table": "projects",
          "record": "record",
          "schema": "public",
          "old_record": null
        }
        ```
        *Actually, the standard Supabase Webhook payload structure is sufficient as the function maps `table` name to `section`.*

9.  Click **Confirm**.

**Repeat this process for all relevant tables:**
*   `bio`
*   `projects`
*   `skills`
*   `experiences`
*   `education`
*   `blog_posts`
*   `project_explanations`
*   `copyright`

---

## 4. Local Development Scripts

### `scripts/generate-local-json.js`
*   **Purpose**: Fetches all data from Supabase and generates local JSON files in `public/data/`.
*   **Usage**: Runs automatically before `npm run build`.
*   **Manual Run**: `npm run generate-json`

### `scripts/auto-sync-json.js`
*   **Purpose**: Polls the public Supabase Storage URL for changes and updates local JSON files. Useful for keeping local dev environment in sync with remote data without restarting.
*   **Usage**: `npm run auto-sync`

---

## 5. Troubleshooting

*   **Function Logs**: Check Supabase Dashboard -> Edge Functions -> `update-section-json` -> Logs for errors.
*   **Webhook History**: Check Database -> Webhooks -> Select Webhook -> History to see if calls are failing (e.g., 401 Unauthorized if secret is wrong).
*   **Storage**: Check if files are actually being updated in the `portfolio-json` bucket.
