import { scryptSync } from "crypto";
import clientPromise from "../../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db('relayDB');

    // Get user by username query parameter
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db('relayDB');

            const { username } = req.query;

            const user = await db
                .collection('users')
                .findOne({ username });

            return res.json(user);
        } catch (e) {
            console.error(e);
        }
    }

    // Create new user
    if (req.method === 'POST') {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUserData = {
                username: req.body.username,
                password: hashedPassword
            }

            const existingUsername = await db
                .collection('users')
                .findOne({ username: req.body.username })

            // If username already exists in db, throw error
            if (existingUsername) {
                res.status(400);
                res.json('Username is already taken');
            }
            // Otherwise, create user
            else {
                const newUser = await db  
                .collection('users')
                .insertOne(newUserData)

                res.json(newUser);
            }
        } catch (e) {
            console.error(e);
        }
    }
}