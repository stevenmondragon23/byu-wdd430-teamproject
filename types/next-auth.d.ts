import { DefaultSession } from "next-auth";

// Este archivo le "enseña" a TypeScript que nuestros usuarios
// tienen un campo extra llamado `role`, que NextAuth no trae
// por defecto. Con esto, ya no hace falta usar `as any` en
// ningún archivo del proyecto: TypeScript sabrá que existe
// en todos lados (session.user.role, token.role, etc).

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

// next-auth/jwt solo re-exporta lo que declara @auth/core/jwt.
// Por eso hay que "enseñarle" el campo también aquí: los
// callbacks internos (como `session`) usan este tipo directamente,
// no el re-export.
declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}