import transporter from "../utils/transporter.js"
import supabase from "../utils/supabase.js";

export const sendMail = async (user_id, reciver_id, subject, body) => {

    const { data: user, error } = await supabase
        .from('users')
        .select('email_id, refresh_token, access_token')
        .eq('email_id', user_id)
        .maybeSingle()

    if (error) throw new Error(error.message)

    if (!user) throw new Error('user is not registered')

    transporter.sendMail({
        from: user_id,
        to: reciver_id,
        subject: subject,
        // text: body,
        html: body,
        auth: {
            user: user.email_id,
            refreshToken: user.refresh_token,
            accessToken: user.access_token,
        },
    }, (err, info) => {
        if(err) throw new Error(err)
        console.log(info);
    });

}