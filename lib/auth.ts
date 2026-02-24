import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

/**
 * NextAuth config. Uses the Supabase adapter when env vars are set so users
 * and sessions are stored in PostgreSQL (next_auth schema).
 */
export const authOptions: NextAuthOptions = {
  adapter:
    supabaseUrl && supabaseSecret
      ? SupabaseAdapter({ url: supabaseUrl, secret: supabaseSecret })
      : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    // With database adapter we get `user`; with JWT we get `token`. Attach id to session.
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = (user?.id ?? token?.sub) ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: supabaseUrl && supabaseSecret ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
