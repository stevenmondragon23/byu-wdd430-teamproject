import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import sql from "@/app/lib/db";

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

        try {
          // Query the database for the user with the provided username
          const users = await sql`
            SELECT user_id, username, first_name, last_name, role, password
            FROM users
            WHERE username = ${credentials.username as string}
          `;

          const user = users[0];

          // Validate the user's password and role
          if (
            user &&
            user.password === credentials.password &&
            user.role === "seller"
          ) {
            return {
              id: user.user_id.toString(),
              name: `${user.first_name} ${user.last_name}`,
              email: user.username,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth Database Error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});