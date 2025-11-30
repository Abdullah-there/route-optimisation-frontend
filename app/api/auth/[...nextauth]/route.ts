import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const db = new Pool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 5432),
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err: any) => console.error("DB connection error:", err));

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text", placeholder: "your username" },
        email: { label: "Email", type: "text", placeholder: "your_email@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const userRes = await db.query(
          "SELECT * FROM users WHERE email = $1 LIMIT 1",
          [credentials.email]
        );

        const existingUser = userRes.rows[0];

        if (existingUser) {
          const isValid = await bcrypt.compare(credentials.password, existingUser.password);

          if (!isValid) return null;

          console.log(`User found: ${existingUser.email}`);
          return existingUser;
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          const insertRes = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [credentials.name, credentials.email, hashedPassword]
          );

          return insertRes.rows[0];
        } catch (error) {
          console.error("Error creating user:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
