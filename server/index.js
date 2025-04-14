import express from "express";
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
import supabase from "./utils/supabase.js";
import nodemailer from 'nodemailer'

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/user', userRoutes);
app.use('/token', tokenRoutes);

app.get("/", (req, res) => {
    res.send("Server is now live");
});

app.get("/:email_id", async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email_id', req.params.email_id)

        
    console.log(data)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: data[0].email_id,
            accessToken: data[0].password,
        },
    });

    transporter.sendMail({
        from: data[0].email_id,
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

