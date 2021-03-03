const functions = require("firebase-functions");
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.googleChatBot = functions.https.onRequest((request, response) => {
    var HEADER = {
        "title": "Meraki Solutions"
    };

    const body = 'Prueba desde firestore';

    functions.logger.info("Google Chat test!", { structuredData: true });

    response.send({
        "cards": [{
            "header": HEADER,
            "sections": [{
                "widgets": [{
                    "textParagraph": {
                        "text": body
                    }
                }]
            }]
        }]
    }
    )
});


exports.createUserSetClaims = functions.auth.user().onCreate(async (user) => {
    functions.logger.info(`create user ${user.email} ${user.uid}`, { structuredData: true });
    const role = 'Administrador';
    const createdAt = new Date();
    try {
        await admin.auth().setCustomUserClaims(user.uid, { role });
        await admin.firestore().collection('users').doc(user.uid).set({
            email: user.email,
            uid: user.uid,
            name: user.displayName,
            picture: user.photoURL,
            role,
            phoneNumber: user.phoneNumber,
            createdAt
        }, { merge: true });
        return;
    } catch (error) {
        functions.logger.info(error, { structuredData: true });
        return;
    }
});

// Example for send mail nodemailer or @sendgrid/mail

// const nodemailer = require('nodemailer');
// const sgMail = require("@sendgrid/mail");
// exports.sendMail = functions.https.onCall(async (data, context) => {
    // *************     nodemailer        **********/
//     let authData = await nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: 'correo',
//             pass: 'contraseña'
//         }
//     });

//     try {
//         await authData.sendMail({
//             from: 'mperez@meraki-s.com',
//             to: ['galarcon@meraki-s.com', 'mhalanocca@meraki-s.com', 'mpalomino@meraki-s.com','mperez@meraki-s.com'],
//             subject: 'Prueba de correos',
//             text: 'Prueba de correos',
//             html: 'Esta es una prueba de correos haciendo una funcion con nodemailer favor de confirmar que se recivio'

//         });
//         return { name: 'Ramon' }
//     } catch (error) {
//         return error;
//     }
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
//             'apikey'
//         );
//         await sgMail.send(msg);
//         return { nombre: 'sucess' }
//     } catch (error) {
//         return  error 
//     }
// });