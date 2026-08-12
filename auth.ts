import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "./app/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { data: user, error } = await supabase
          .from("users")
          .select("user_id, username, first_name, last_name, role, password")
          .eq("username", credentials.username)
          .maybeSingle();

        if (error || !user) {
          throw new Error("USER_NOT_FOUND");
        }

        if (!user.password) {
          throw new Error("INVALID_PASSWORD");
        }

        const passwordMatches = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatches) {
          throw new Error("INVALID_PASSWORD");
        }

        return {
          id: user.user_id.toString(),
          name: `${user.first_name} ${user.last_name}`,
          email: user.username,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});