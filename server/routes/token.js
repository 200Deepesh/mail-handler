import express from 'express'
import { oauth2Client } from '../utils/oauth2.js'
import supabase from "../utils/supabase.js"

const router = express.Router()


router.get('/access', async (req, res) => {
    console.log(req.url)
    const code = req.query.code;
    if (code) {
        const { tokens } = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens);
        if (tokens.refresh_token) {
            let { error } = await supabase
                .from('users')
                .update({ refresh_token: tokens.refresh_token })
                .eq('email_id', process.env.SENDER_EMAIL_ID)

            if (error) throw new Error(error.message)

            console.log('refresh:', tokens.refresh_token);
        }
        console.log('access:', tokens.access_token);

        const { error } = await supabase
            .from('users')
            .update({access_token: tokens.access_token})
            .eq('email_id', process.env.SENDER_EMAIL_ID)

        if(error) throw new Error(error.message)

        return res.redirect('/');
    }
    return res.status(400).send('authentication code is missing')
})

export default router;




