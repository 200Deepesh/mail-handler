import express from "express";
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
import authRoutes from "./routes/auth.js"
import { sendMail } from "./controllers/mail.js";
import { subject, firstMail } from "./emailTemplate.js";

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
    const user_id = req.params.email_id
    const user_name = req.query.name
    const body = user_name? firstMail.replace('{name}', user_name): firstMail.replace('{name}', '')

    // console.log(user_id)
    await sendMail(user_id, 'deepeshgupta8843@gmail.com', subject, body)
})

app.listen(PORT, () => {
    console.log(`server is started in port ${PORT}`)
})

