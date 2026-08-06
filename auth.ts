import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock database of users for demonstration purposes
const usersDatabase = [
  {
    user_id: 1,
    username: "artisanAnna",
    first_name: "Anna",
    last_name: "Smith",
    role: "seller",
    password: "seller123",
  },
  {
    user_id: 2,
    username: "woodWorks",
    first_name: "Michael",
    last_name: "Brown",
    role: "seller",
    password: "seller123",
  },
  {
    user_id: 3,
    username: "crochetLove",
    first_name: "Emily",
    last_name: "Johnson",
    role: "seller",
    password: "seller123",
  },
  {
    user_id: 4,
    username: "john23",
    first_name: "John",
    last_name: "Davis",
    role: "customer",
    password: null,
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = usersDatabase.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password,
        );

        // Validate that the user is a seller before returning the user object
        if (user && user.role === "seller") {
          return {
            id: user.user_id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            email: user.username,
            role: user.role,
          };
        }

        return null;
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
