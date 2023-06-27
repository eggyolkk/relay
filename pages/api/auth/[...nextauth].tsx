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
                return {
                  name: user.username,
                }
              }
              return null;
            }

            return null;
          },
        }),
    ],
}

export default NextAuth(authOptions);