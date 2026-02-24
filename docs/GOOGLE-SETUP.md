# How to get Google Client ID and Client Secret

Follow these steps once. You’ll get two values to paste into `.env.local`.

---

## 1. Open Google Cloud Console

Go to: **https://console.cloud.google.com/apis/credentials**

Sign in with the Google account you want to use for this (it can be a personal or work account).

---

## 2. Create or pick a project

At the top of the page you’ll see a **project** dropdown (it might say “Select a project” or the name of an existing project).

- **If you see a project already:** You can use it, or create a new one.
- **To create a new project:** Click the dropdown → **New Project** → give it a name (e.g. “Bosh”) → **Create**. Wait a few seconds, then select that project from the dropdown.

You’ll do the next steps inside this project.

---

## 3. Open the OAuth consent screen (first time only)

Google may ask you to set up the “OAuth consent screen” before you can create credentials. If you see a button or link for that, do it first:

1. In the left sidebar, click **OAuth consent screen** (under “APIs & Services”), or use the main **Credentials** page and look for a prompt about the consent screen.
2. Choose **External** (so anyone with a Google account can sign in to your app) → **Create**.
3. Fill in:
   - **App name:** Bosh (or whatever you want users to see when they sign in)
   - **User support email:** Your email
   - **Developer contact email:** Your email
4. Click **Save and Continue**.
5. On “Scopes”: click **Save and Continue** (you don’t need to add extra scopes for basic sign-in).
6. On “Test users”: click **Save and Continue** (for local dev you don’t need to add test users).
7. Click **Back to Dashboard**.

You only need to do this once per project.

---

## 4. Create the OAuth client (Client ID + Secret)

1. In the left sidebar, click **Credentials** (under “APIs & Services”), or go to: **https://console.cloud.google.com/apis/credentials**
2. Click the **+ Create credentials** button at the top.
3. Choose **OAuth client ID**.
4. **Application type:** select **Web application**.
5. **Name:** e.g. “Bosh local” or “Bosh web” (this is just for you to recognize it).
6. **Authorized redirect URIs:**  
   Click **+ Add URI** and type exactly (use your port if it’s not 3001):
   ```text
   http://localhost:3001/api/auth/callback/google
   ```
   Don’t add a slash at the end. Don’t use `https` for localhost.
7. Click **Create**.

---

## 5. Copy the Client ID and Client Secret

A popup or dialog will show:

- **Your Client ID** — long string ending in something like `….apps.googleusercontent.com`
- **Your Client secret** — shorter string (you may need to click “Show” or an eye icon to see it)

Copy both (use the copy icons if they’re there).

---

## 6. Put them in `.env.local`

Open your project’s `.env.local` file and set:

```env
GOOGLE_CLIENT_ID=paste-the-client-id-here
GOOGLE_CLIENT_SECRET=paste-the-client-secret-here
```

No quotes, no spaces around the `=`. Save the file.

---

## 7. Restart your app

Stop your dev server (Ctrl+C), then run `npm run dev` again. Try **Sign in** → **Continue with Google** in your app. It should redirect to Google, then back to your app with you signed in.

---

## If something goes wrong

- **“Redirect URI mismatch”** — The redirect URI in Google must match exactly what your app uses: same port (e.g. 3001), `http` (not `https`) for localhost, and the path `/api/auth/callback/google`.
- **“Access blocked” or consent screen** — Make sure the OAuth consent screen is set to **External** and you’ve completed the consent screen steps (app name, emails, Save and Continue through the steps).
- **Can’t find Credentials** — Left sidebar: **APIs & Services** → **Credentials**.

When you deploy to a **live site**, you’ll add a second redirect URI in the same OAuth client (or create a new one) for your production URL, e.g. `https://your-site.com/api/auth/callback/google`.
