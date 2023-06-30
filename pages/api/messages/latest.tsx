import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) =>  {
    const client = await clientPromise;
    const db = client.db('relayDB');

    const count = req.query.count;

    // Retrieve messages
    if (req.method === 'GET') {
        const messages = await db 
            .collection('messages')
            .find()
            .sort({_id:-1})
            .limit(Number(count))
            .toArray()

        return res.json(messages)
    }
}