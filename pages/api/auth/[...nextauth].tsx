import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider ({
          type: "credentials",
          credentials: {},
          async authorize(credentials, req) {
            const { username, password } = credentials as {
              username: string;
              password: string;
            };

            // Check if user is valid
            const client = await clientPromise;
            const db = client.db('relayDB');

            const user = await db
                .collection('users')
                .findOne({ username });

            if (user) {
              const isValidPassword = await bcrypt.compare(password, user.password);
              if (isValidPassword) {
                return user as any;
              }
              return null;
            }

            return null;
          },
        }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        return { ...token, ...user };
      },
      async session({ session, token, user }) {
        session.user = token;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);