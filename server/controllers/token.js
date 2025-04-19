import { oauth2Client } from "../utils/oauth2.js"
import supabase from "../utils/supabase.js";

export const generateAuthUrl = async () => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://mail.google.com/",
        prompt: "consent"
    })

    return url
}

export const generateAccessToken = async (user_id) => {
    const { data: user, error: findError } = await supabase
        .from('users')
        .select('email_id, refresh_token')
        .eq('email_id', user_id)
        .maybeSingle()

    if (findError) throw new Error(findError.message)

    if (!user) throw new Error("user is not registered")

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: "POST",
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: user.refresh_token,
            grant_type: 'refresh_token'
        })
    })

    const { access_token, error } = JSON.parse(res);

    if (error) throw new Error("Your google cridentials are get expired so please login again to generate new cridentials!!!")

    const { error: saveError } = await supabase
        .from('users')
        .update({ 'access_token': access_token })
        .eq('email_id', user_id)

    if (saveError) throw new Error(saveError.message);

    return access_token;
}