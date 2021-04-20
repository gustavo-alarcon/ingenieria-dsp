const functions = require("firebase-functions");
const admin = require('firebase-admin');
//const { sendMailExample } = require('./functions/send-emails/send-mail-example');
const { createUserSetClaims } = require('./functions/auth/create-user-claims');
const gaxios = require('gaxios')
const SENDGRID_APY_KEY = require('./keys.json').ferreyros_01


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
   return await createUserSetClaims(user);
});

// exports.sendMailExample = functions.https.onCall(async (data, context) => {
//     return await sendMailExample(data, context);
// });
exports.sendGrid = functions.firestore.document(`db/ferreyros/evaluationsAux/{evalId}`)
    .onCreate((event) => {

        let eval = event.data();
        console.log("receiving request")

        const data = {
            personalizations: {
                to: "jobando@meraki-s.com",//data.finalizedBy.email
            },
            from: {
                email: "jobando@meraki-s.com",  //Here should be a verified
                name: "Junjiro en Meraki"
            },
            // reply_to: {
            //     email: "jobando@meraki-s.com",
            //     name: "No responder"
            // },
            subject: "Mensaje Prueba SendGrid",
            content:[
                {
                    type: "text/plain",
                    value: "Contenido"
                }
            ],
            attachments: [],
            template_id: "931ffd164fd0447e82cb21f3f748b76d",
            dynamic_template_data: {
                component: eval.description,
                partNumber: eval.partNumber,
                quantity: eval.quantity,
                kindOfTest: eval.kindOfTest ? eval.kindOfTest:"--",
                result: eval.result ? eval.result : "--",
                length_mm: eval.length ? eval.length : 0,
                inspector: eval.finalizedBy.name,
                observations: eval.observations,
                comments: eval.comments ? eval.comments : "Sin comentarios",
                extends: eval.extends ? eval.extends : []
            }
        }

        const options = {
            "method": "POST",
            "url": "/v3/mail/send",
            "baseURL": "https://api.sendgrid.com",
            "port": null,
            "headers": {
                "authorization": `Bearer ${SENDGRID_APY_KEY}`,
                "content-type": "application/json"
            },
            data: data
        };

        console.log("Just before sending email")
        console.log("Sending email to:"+data.personalizations.to)

        return gaxios.request(options)
            .then(res2 => {
                console.log(`Successful email sent!`)
            })
            .catch(err => {
                console.log("Error: ")
                console.log(err.errors)
            })
    }
)