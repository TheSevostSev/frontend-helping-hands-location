import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    tokenValue?: string;
    authMessage?: string;
  }
}
