import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies"
import { nodeModuleNameResolver } from "typescript";
import posts from '../../data/posts.json'

interface TokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}


export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<String>
) {

    if (!("code" in req.query)) {
        res.status(500)
        res.send("No Authorization Code")
        return
    }

    if ("error" in req.query) {
        res.status(500)
        res.send(`${req.query.error}`)
        return
    }

    const code = req.query.code as string;
    const state = req.query.state

    const host = process.env.NODE_ENV === "production" ? "prod_url" : "http://localhost:3000"
    const redirectUri = `${host}/api/callback`
    const body = new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
    });

    try {

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64")}`,
            },
            body,
        });

        const responseData: TokenResponse = await response.json();

        if(!responseData.access_token){
            res.status(500)
        }

        setCookie({res}, 'access_token', responseData.access_token, {
            path:"/",
            maxAge: responseData.expires_in,
            secure: process.env.NODE_ENV === "production"
        })

        setCookie({res}, 'refresh_token', responseData.refresh_token, {
            path:"/",
            maxAge: responseData.expires_in,
            secure: process.env.NODE_ENV === "production"
        })

        // redirect back to main page
        res.redirect("/select")


    } catch (e) {
        res.status(500);
        res.send("Error in getting token")

    }

}