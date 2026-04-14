import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "@/lib/axios";

// Extend NextAuth types to carry role and access token
declare module "next-auth" {
  interface User {
    role: string;
    accessToken: string;
  }
  interface Session {
    user: {
      role: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Call FastAPI login — sets refresh token as HTTP-only cookie
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { access_token } = res.data;

          // Fetch user profile with the access token
          const meRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${access_token}` },
          });

          const user = meRes.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, copy user fields into the JWT
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
});
