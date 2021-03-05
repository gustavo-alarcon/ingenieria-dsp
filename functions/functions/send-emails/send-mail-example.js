const nodemailer = require('nodemailer');
// const sgMail = require("@sendgrid/mail");

const sendMailExample = (async (data, context) => {
    // *************     nodemailer        **********/
    let authData = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    });

    try {
        await authData.sendMail({
            from: 'mperez@meraki-s.com',
            to: ['mapcsasystem@gmail.com'],
            subject: 'Prueba de correos',
            text: 'Prueba de correos',
            html: 'Esta es una prueba de correos haciendo una funcion con nodemailer favor de confirmar que se recivio'

        });
        return { name: 'Ramon' }
    } catch (error) {
        return error;
    }
    // *************     sendgrid        **********/
    //     try {

    //         const text = `<div>
    //       <h4>Information</h4>
    //       <ul>
    //       <li>
    //       Name - kjhjkhkjh
    //       </li>
    //       <li>
    //       Email - kjhkjhkjhj
    //       </li>
    //       <li>
    //       Phone - kjhkjhjk
    //       </li>
    //       </ul>
    //       <h4>Message</h4>
    //       <p>"jhgjhg"}</p>
    //       </div>`;
    //         const msg = {
    //             to: "mapcsasystem@gmail.com",
    //             from: "mperez@meraki-s.com",
    //             subject: `sent you a new message`,
    //             text: text,
    //             html: text
    //         };
    //         sgMail.setApiKey(
    //             'apikey'  **************aqui va el apikey de send grid ********
    //         );
    //         await sgMail.send(msg);
    //         return { nombre: 'sucess' }
    //     } catch (error) {
    //         return  error 
    //     }
});

module.exports = {
    sendMailExample
}