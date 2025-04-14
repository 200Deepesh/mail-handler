import supabase from "../utils/supabase.js";
import express from "express"

const router = express.Router()

router.get("/", async (req, res) => {
    let { data, error } = await supabase
        .from('users')
        .select()
    if (error) throw new Error(error.message)

    return res.json(data);
})

router.post("/", async (req, res) => {
    let user = req.body;
    let { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
    if (error) throw new Error(error.message)

    return res.json(data);
})

router.patch("/", async (req, res) => {
    let user = req.body;
    console.log(user)
    let { error } = await supabase
        .from('users')
        .update({ password: null })
        .eq("email_id", user.email_id)

    if (error) throw new Error(error.message)

    return res.send('updated');
})

router.delete("/", async (req, res) => {
    let user = req.body;
    console.log(user)
    let { error } = await supabase
        .from('users')
        .delete()
        .eq("email_id", user.email_id)

    if (error) throw new Error(error.message)

    return res.send('deleted');
})

export default router;
