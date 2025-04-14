import express from "express";
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
import authRoutes from "./routes/auth.js"
import supabase from "./utils/supabase.js";
import nodemailer from 'nodemailer'

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/user', userRoutes);
app.use('/token', tokenRoutes);
app.use('/auth', authRoutes)

app.get("/", (req, res) => {
    return res.send("Server is now live");
});

app.get("/sendmail/:email_id", async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('email_id, access_token')
        .eq('email_id', req.params.email_id)
        .maybeSingle()

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: data.email_id,
            accessToken: data.access_token,
        },
    });

    transporter.sendMail({
        from: data.email_id,
        to: "deepeshgupta8843@gmail.com",
        subject: "Message",
        text: "I hope this message gets through!",
    }, (error, info)=>{
        if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.messageId);
          }
    })
    return res.send('check you inbox');
})

app.listen(PORT, () => {
    console.log(`server is started in port ${PORT}`)
})

