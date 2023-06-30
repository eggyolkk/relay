import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) =>  {
    const client = await clientPromise;
    const db = client.db('relayDB');

    // Retrieve messages
    if (req.method === 'GET') {
        const messages = await db 
            .collection('messages')
            .find()
            .toArray()

        return res.json(messages)
    }

    // Send a message
    if (req.method === 'POST') {
        try {
            const newMessage = req.body;

            const messages = await db
                .collection('messages')
                .insertOne(newMessage)

            res.json(messages);
        } catch(e) {
            console.error(e);
        }
    }
}