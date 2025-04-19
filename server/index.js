import express from "express";
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
import authRoutes from "./routes/auth.js"
import { sendMail } from "./controllers/mail.js";
import { subject, firstMail } from "./emailTemplate.js";
import supabase from "./utils/supabase.js";

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

app.get("/clients", async (req, res) => {
    let { data, error } = await supabase
        .from('clients')
        .select()
    if (error) throw new Error(error.message)

    return res.json(data);
})

app.get("/sendmail/:email_id", async (req, res) => {
    const user_id = req.params.email_id
    const reciver_id = 'deepeshgupta8843@gmail.com'

    // console.log(user_id)
    await sendMail(user_id, reciver_id, subject, firstMail)
    return res.send('mail is sent')
})

app.listen(PORT, () => {
    console.log(`server is started in port ${PORT}`)
})

