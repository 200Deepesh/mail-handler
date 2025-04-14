import { google } from "googleapis"
import express from 'express'
import supabase from "../utils/supabase.js"

const router = express.Router()

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
)

router.get('/refresh', async (req, res) => {
    let { data, error } = await supabase
        .from('users')
        .select()
        .eq('email_id', process.env.SENDER_EMAIL_ID)

    if (error) throw new Error(error.message)
    if (data.refresh_token) {
        oauth2Client.setCredentials({
            refresh_token: data.refresh_token
        });
    }

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://mail.google.com/"
    })

    if (url) {
        return res.redirect(url)
    }
    return res.send("url is\n", url)
})

router.get('/access', async (req, res) => {
    console.log(req.url)
    let code = req.query.code;
    if (code) {
        const { tokens } = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens);
        if (tokens.refresh_token) {
            let { error } = await supabase
                .from('users')
                .update({ refresh_token: tokens.refresh_token })
                .eq('email_id', process.env.SENDER_EMAIL_ID)

            if (error) throw new Error(error.message)

            console.log('refresh', tokens.refresh_token);
        }
        console.log('access', tokens.access_token);

        let { error } = await supabase
            .from('users')
            .update({password: tokens.access_token})
            .eq('email_id', process.env.SENDER_EMAIL_ID)
        return res.redirect('/');
    }
    return res.status(400).send('authentication code is missing')
})

export default router;




