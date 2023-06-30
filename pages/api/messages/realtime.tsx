

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) =>  {
    const client = await clientPromise;
    const db = client.db('relayDB');

    // Retrieve messages
    if (req.method === 'GET') {
            
        const changeStream = db
            .collection('messages')


        for  await (const  change  of  changeStream.watch()) {
            res.json(change);
        }

    }
}