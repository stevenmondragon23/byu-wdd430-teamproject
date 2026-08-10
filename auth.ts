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

        // Buscamos al usuario en la tabla real de Supabase, no en un mock.
        const { data: user, error } = await supabase
          .from("users")
          .select("user_id, username, first_name, last_name, role, password")
          .eq("username", credentials.username)
          .single();

        if (error || !user || !user.password) {
          return null;
        }

        // Comparamos la contraseña ingresada contra el hash guardado en la BD.
        const passwordMatches = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatches) {
          return null;
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