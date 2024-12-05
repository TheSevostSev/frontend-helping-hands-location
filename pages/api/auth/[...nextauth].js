import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sendGoogleToken } from "../../../src/app/api/auth";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // JWT callback
    async jwt({ account, token }) {
      if (account) {
        try {
          const data = await sendGoogleToken(account.id_token);
          token.value = data.token;
          token.authMessage = "Login is successful!";
        } catch (error) {
          token.value = null;
          token.authMessage = `Error occurred during login: ${error.message}`;
        }
      }
      return token;
    },
    // Session callback
    async session({ session, token }) {
      session.tokenValue = token.value || null; // Use null if value is undefined
      session.authMessage = token.authMessage || "No message available"; // Provide a default message
      return session;
    },
    // Redirect callback
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
