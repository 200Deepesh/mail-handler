import transporter from "../utils/transporter.js"
import supabase from "../utils/supabase.js";

export const sendMail = async (user_id, reciver_id, subject, bodyTemplate) => {

    const { data: user, error: userTableErr } = await supabase
        .from('users')
        .select('email_id, refresh_token, access_token')
        .eq('email_id', user_id)
        .maybeSingle()

    if (userTableErr) throw new Error(error.message)

    if (!user) throw new Error('user is not registered')

    const { data: client, error: clientTableErr } = await supabase
        .from('clients')
        .select()
        .eq('client_id', reciver_id)
        .maybeSingle()

    if (clientTableErr) throw new Error(clientTableErr.message)

    let body = client.client_name ? bodyTemplate.replace('{name}', client.client_name) : bodyTemplate.replace(' {name}', '')

    const date = new Date()

    const url_id = `?sender=${user_id}&reciver=${reciver_id}&date=${date.getTime()}`

    console.log(date, url_id)

    const html_body = body.replace('{url-id}', url_id)

    transporter.sendMail({
        from: user_id,
        to: reciver_id,
        subject: subject,
        // text: body,
        html: html_body,
        auth: {
            user: user.email_id,
            refreshToken: user.refresh_token,
            accessToken: user.access_token,
        },
    }, async (err, info) => {
        if (err) throw new Error(err)

        const { error: clientTableErr } = await supabase
            .from('clients')
            .update({ 'message_id': info.messageId })
            .eq('client_id', reciver_id)
            .eq('user_id', user_id)

        if (clientTableErr) throw new Error(clientTableErr.message)

        console.log(subject)
        const { error: sendedTableErr } = await supabase
            .from('sended')
            .insert({ 'message_id': info.messageId, 'date': date.getTime(), 'subject': subject })

        if (sendedTableErr) throw new Error(sendedTableErr.message)

    });

}