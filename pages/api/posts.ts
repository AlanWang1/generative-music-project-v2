import { NextApiRequest, NextApiResponse } from "next";
import posts from '../../data/posts.json'

export default function Handler(
    req:NextApiRequest,
    res:NextApiResponse<String> 
) {
    res.status(200).send(JSON.stringify(posts))
}
