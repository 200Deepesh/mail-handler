import nodemailer from 'nodemailer'
import supabase from './supabase.js';

console.log(process.env.GOOGLE_CLIENT_ID)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
});

transporter.on('token', async (token) => {
    const { error } = await supabase
        .from('users')
        .update({ access_token: token.accessToken })
        .eq('email_id', token.user)

    if (error) throw new Error(error.message)

    console.log('new access_token is created and saved success fully')
})

export default transporter;