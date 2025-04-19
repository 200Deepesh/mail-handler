import express from 'express'
import supabase from '../utils/supabase.js';
import { generateAuthUrl } from '../controllers/token.js';

const router = express.Router()

router.post('/login', async (req, res) => {
    const { email_id: userID, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('email_id, refresh_token')
        .eq('email_id', userID)
        .maybeSingle()

    if(error) throw new Error(error.message)

    if(!user) return res.redirect('/auth/signup')
    
    if(!user.refresh_token) {
        const url = await generateAuthUrl()
        // return res.send(url)
        return res.redirect(url);
    }

    return res.redirect('/')
})

export default router;