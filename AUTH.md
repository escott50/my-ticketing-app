# Auth setup (Bosh)

This guide walks you through getting “Sign in with Google” working. No database is required—the app just needs a few values in a file and a one-time setup in Google’s website.

---

## Why each piece exists

- **NEXTAUTH_SECRET** — A long random string your app uses to encrypt the “logged in” state. It has to be random and secret so nobody can fake being signed in.
- **NEXTAUTH_URL** — The address where your app lives (e.g. `http://localhost:3001` on your computer, or `https://your-site.com` when live). NextAuth uses this so “Sign in with Google” can send users back to the right place.
- **Google Client ID & Secret** — When someone clicks “Continue with Google,” your app talks to Google. Google only allows apps it knows about. You register Bosh in Google Cloud and get these two values so Google can say “yes, this app is allowed to use Sign in with Google” and send the user back to your app with their name/email.

---

## Step 1: Create your local env file

You need a file named `.env.local` in your project (same folder as `package.json`). It holds secrets and config that are only on your machine and are not committed to git.

In the terminal, from your project folder, run:

```bash
cp .env.example .env.local
```

That copies the example file. Now open `.env.local` and fill in the values below.

---

## Step 2: Set NEXTAUTH_SECRET

This is a **long random string** used to encrypt the session. It doesn’t have to be memorable—you’ll never type it again.

**Option A — Use a password generator (easiest)**  
Open any password generator (e.g. 1Password, LastPass, or a site like random.org/passwords). Generate a long password (at least 32 characters), copy it, and paste it as the value of `NEXTAUTH_SECRET` in `.env.local`. No spaces or quotes needed.

**Option B — Use the terminal**  
If someone told you to run `openssl rand -base64 32`: that’s a command that prints one long random string. You copy that output and paste it as `NEXTAUTH_SECRET`. You only run it once; you’re not “using OpenSSL” day to day—it’s just a way to get a random secret.

In `.env.local` it should look like (with your own value):

```
NEXTAUTH_SECRET=your-long-random-string-here
```

---

## Step 3: Set NEXTAUTH_URL

This is the URL where your app runs.

- **On your computer:** Use the port you actually use, e.g. `http://localhost:3001` (or `3000` if that’s what you use).
- **When you deploy:** You’ll set this to your live URL (e.g. `https://bosh.vercel.app`) in your hosting provider’s environment variables.

Example for local:

```
NEXTAUTH_URL=http://localhost:3001
```

---

## Step 4: Get Google sign-in credentials

Your app needs Google’s permission to offer “Sign in with Google.” You do that once in Google Cloud Console and get two values: Client ID and Client Secret.

**Detailed walkthrough:** See **[docs/GOOGLE-SETUP.md](docs/GOOGLE-SETUP.md)** for a full step-by-step with screenshots-style instructions.

Short version:
2. At the top, create or select a **project** (e.g. name it “Bosh”).
3. Click **Create credentials** → **OAuth client ID**.
4. If Google asks you to set the “OAuth consent screen,” choose **External** (so any Google user can sign in), fill in app name (e.g. “Bosh”), and save.
5. Back at “Create OAuth client ID”:
   - Application type: **Web application**.
   - Name: e.g. “Bosh web.”
   - Under **Authorized redirect URIs**, click **Add URI** and enter exactly (use your port if not 3001):
     - `http://localhost:3001/api/auth/callback/google`
6. Click **Create**. A popup will show your **Client ID** and **Client secret**. Copy both.
7. In `.env.local` set:
   - `GOOGLE_CLIENT_ID=` then paste the Client ID.
   - `GOOGLE_CLIENT_SECRET=` then paste the Client secret.

Save `.env.local`. Don’t share this file or commit it to git (it’s in `.gitignore`).

---

## Step 5: Run the app and test

Restart your dev server (stop it with Ctrl+C, then run `npm run dev` again). Open your app in the browser (e.g. `http://localhost:3001`), click **Sign in** in the header, then **Continue with Google**. You should sign in and see your email and a **Sign out** button.

---

## When you deploy to a live site

You’ll set the same variable names in your hosting provider (e.g. Vercel or Netlify), but with production values:

- `NEXTAUTH_URL` = your live URL (e.g. `https://your-site.com`).
- In Google Cloud Console, add another **Authorized redirect URI**: `https://your-site.com/api/auth/callback/google`.

You can keep `NEXTAUTH_SECRET` and the same Google Client ID/Secret, or create a new OAuth client for production if you prefer.

---

## Using the session in code (for later)

- **In client components:** `import { useSession } from "next-auth/react"` then `const { data: session } = useSession()`. You get `session?.user?.id` and `session?.user?.email`.
- **On the server:** `import { getServerSession } from "next-auth"` and `import { authOptions } from "@/lib/auth"`, then `const session = await getServerSession(authOptions)`.

When you add payments, you’ll pass that user id or email to your payment provider so each order is tied to the signed-in user.
