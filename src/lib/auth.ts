import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { GOOGLE_HEALTH_SCOPES_PLACEHOLDER } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // TODO: Replace with finalized Google Health API scopes
          scope: [
            "openid",
            "email",
            "profile",
            ...GOOGLE_HEALTH_SCOPES_PLACEHOLDER,
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/connect",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.sub) {
        await prisma.user.updateMany({
          where: { email: profile.email ?? undefined },
          data: { googleAccountId: profile.sub },
        });
      }
      return true;
    },
  },
});
