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
exports.sendGrid = functions.firestore.document(`db/ferreyros/evaluations/{evalId}`)
    .onUpdate((event) => {
        let eval = event.after.data();
        if((eval.internalStatus == "finalized") &&
            ((eval.result == "fuera de servicio") || (eval.result == "ampliacion") || (eval.result.toLowerCase() == "dsr"))){

            //Cuando resultado de fin Fuera de Servicio o ampliación
            //Pre evaluacion: OT Child / OF / NP / Task / Resultado
            console.log("receiving request")

            const data = {
                personalizations: [{
                    to: eval.emailList.map(em => ({
                        email: em,
                        name: em,
                    })),
                    dynamic_template_data: {
                        component: eval.description,
                        partNumber: eval.partNumber,
                        quantity: eval.quantity,
                        kindOfTest: eval.kindOfTest ? eval.kindOfTest:"--",
                        result: eval.result,
                        length_mm: eval.length ? eval.length : 0,
                        inspector: eval.finalizedBy.name,
                        observations: eval.observations,
                        comments: eval.comments ? eval.comments : "Sin comentarios",
                        extends: eval.extends ? eval.extends : [],
                        otChild: eval.otChild,
                        task: eval.task,
                        of: eval.wof
                    },
                    subject: "Mensaje Prueba SendGrid",
                }],
                from: {
                    email: "soportetecnicoingenieria@ferreyros.com.pe",  //Here should be a verified
                    name: "Ingeniería Ferreyros"
                },
                // reply_to: {
                //     email: "jobando@meraki-s.com",
                //     name: "No responder"
                // },
                subject: "Mensaje Prueba SendGrid",
                content:[
                    {
                        type: "text/html",
                        value: "Contenido"
                    }/*,{
                        type: "image/png",
                        value: "contenido"
                    },{
                        type: "image/jpeg",
                        value: "contenido"
                    }*/
                ],
                // attachments: [],
                template_id: "d-931ffd164fd0447e82cb21f3f748b76d",
                
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

            return gaxios.request(options)
                .then(res2 => {
                    console.log(`Successful email sent!`)
                })
                .catch(error => {
                    console.log("Error: ")
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log(error.message);
                    }
                    console.log(error.config);
            })
        }
    }
)

exports.sendDataToEndpoitFerreyros = functions.https.onRequest((data, params) => {
    if (params) {
        const body = params.body;

        console.log(params);
    }
})

exports.sendDataToEND = functions.firestore.document(`db/ferreyros/andon/{andonId}`)
    .onWrite((event) => {
        console.log(event.after.data());
    })