const functions = require("firebase-functions");
const admin = require('firebase-admin');
//const { sendMailExample } = require('./functions/send-emails/send-mail-example');
const { createUserSetClaims } = require('./functions/auth/create-user-claims');
const gaxios = require('gaxios')
// const SENDGRID_APY_KEY = require('./keys.json').ferreyros_01


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
// exports.sendGrid = functions.firestore.document(`db/ferreyros/evaluations/{evalId}`)
//     .onUpdate((event) => {
//         let eval = event.after.data();
//         if ((eval.internalStatus == "finalized") &&
//             ((eval.result == "fuera de servicio") || (eval.result == "ampliacion") || (eval.result.toLowerCase() == "dsr"))) {

//             //Cuando resultado de fin Fuera de Servicio o ampliación
//             //Pre evaluacion: OT Child / OF / NP / Task / Resultado
//             console.log("receiving request")

//             const data = {
//                 personalizations: [{
//                     to: eval.emailList.map(em => ({
//                         email: em,
//                         name: em,
//                     })),
//                     dynamic_template_data: {
//                         component: eval.description,
//                         partNumber: eval.partNumber,
//                         quantity: eval.quantity,
//                         kindOfTest: eval.kindOfTest ? eval.kindOfTest : "--",
//                         result: eval.result,
//                         length_mm: eval.length ? eval.length : 0,
//                         inspector: eval.finalizedBy.name,
//                         observations: eval.observations,
//                         comments: eval.comments ? eval.comments : "Sin comentarios",
//                         extends: eval.extends ? eval.extends : [],
//                         otChild: eval.otChild,
//                         task: eval.task,
//                         of: eval.wof
//                     },
//                     subject: "Mensaje Prueba SendGrid",
//                 }],
//                 from: {
//                     email: "soportetecnicoingenieria@ferreyros.com.pe",  //Here should be a verified
//                     name: "Ingeniería Ferreyros"
//                 },
//                 // reply_to: {
//                 //     email: "jobando@meraki-s.com",
//                 //     name: "No responder"
//                 // },
//                 subject: "Mensaje Prueba SendGrid",
//                 content: [
//                     {
//                         type: "text/html",
//                         value: "Contenido"
//                     }/*,{
//                         type: "image/png",
//                         value: "contenido"
//                     },{
//                         type: "image/jpeg",
//                         value: "contenido"
//                     }*/
//                 ],
//                 // attachments: [],
//                 template_id: "d-931ffd164fd0447e82cb21f3f748b76d",

//             }

//             const options = {
//                 "method": "POST",
//                 "url": "/v3/mail/send",
//                 "baseURL": "https://api.sendgrid.com",
//                 "port": null,
//                 "headers": {
//                     "authorization": `Bearer ${SENDGRID_APY_KEY}`,
//                     "content-type": "application/json"
//                 },
//                 data: data
//             };

//             console.log("Just before sending email")

//             return gaxios.request(options)
//                 .then(res2 => {
//                     console.log(`Successful email sent!`)
//                 })
//                 .catch(error => {
//                     console.log("Error: ")
//                     if (error.response) {
//                         // The request was made and the server responded with a status code
//                         // that falls out of the range of 2xx
//                         console.log(error.response.data);
//                         console.log(error.response.status);
//                         console.log(error.response.headers);
//                     } else if (error.request) {
//                         // The request was made but no response was received
//                         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//                         // http.ClientRequest in node.js
//                         console.log(error.request);
//                     } else {
//                         // Something happened in setting up the request that triggered an Error
//                         console.log(error.message);
//                     }
//                     console.log(error.config);
//                 })
//         }
//     }
//     )

exports.sendAndonToEndpoint = functions.firestore.document(`db/ferreyros/andon/{andonId}`)
    .onWrite(async (event) => {
        const andon = await event.after.data();

        let url;
        await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
            url = val.data()['endpoint'];

            const data =
            {
                "type": "andon",
                "otChild": andon.otChild,
                "bay": andon.name,
                "problemType": andon.problemType,
                "description": andon.description,
                "images": andon.images ? Object.values(andon.images).join('@@') : '',
                "emailList": andon.emailList.toString()
            }

            const options = {
                "method": "POST",
                "url": url,
                "port": null,
                "headers": {
                    "authorization": `*`,
                    "content-type": "application/json"
                },
                data: data
            };

            console.log("Just before sending email: ", data);

            return gaxios.request(options)
                .then(res2 => {
                    console.log(`✉️ Andon data sent!`)
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
        });
    })

exports.sendPreevaluationToEndpoint = functions.firestore.document(`db/ferreyros/evaluations/{evalId}`)
    .onUpdate(async (event) => {
        let eval = event.after.data();
        if ((eval.internalStatus == "finalized") &&
            ((eval.result == "fuera de servicio") || (eval.result == "ampliacion") || (eval.result.toLowerCase() == "dsr"))) {

            //Cuando resultado de fin Fuera de Servicio o ampliación
            //Pre evaluacion: OT Child / OF / NP / Task / Resultado
            console.log("receiving request")

            let url;
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];

                const data =
                {
                    "type": "preevaluation",
                    "otMain": eval.otMain ? eval.otMain : '-',
                    "otChild": eval.otChild ? eval.otChild : '-',
                    "wof": eval.wof ? eval.wof : '-',
                    "task": eval.task ? eval.task : '-',
                    "component": eval.description ? eval.description : '-',
                    "partNumber": eval.partNumber ? eval.partNumber : '-',
                    "quantity": eval.quantity ? eval.quantity : '-',
                    "kindOfTest": eval.kindOfTest ? eval.kindOfTest : '-',
                    "result": eval.result ? eval.result : '-',
                    "lenght_mm": eval.length ? eval.length : '-',
                    "inspector": eval.finalizedBy.name ? eval.finalizedBy.name : eval.finalizedBy,
                    "comments": eval.comments ? eval.comments : '-',
                    "observations": eval.observations ? eval.observations : '-',
                    "extends": eval.extends ? eval.extends.join('@@') : '',
                    "images": (eval.resultImage1 && eval.resultImage2) ? [eval.resultImage1, eval.resultImage2].join('@@') : '',
                    "emailList": eval.emailList ? eval.emailList.toString() : ''
                }

                const options = {
                    "method": "POST",
                    "url": url,
                    "port": null,
                    "headers": {
                        "authorization": `*`,
                        "content-type": "application/json"
                    },
                    data: data
                };

                console.log("Just before sending email: ", data);

                return gaxios.request(options)
                    .then(res2 => {
                        console.log(`✉️ Preevaluation data sent!`)
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

            });
        }
    }
    )

exports.sendQualityToEndpoint = functions.firestore.document(`db/ferreyros/quality/{qualityId}`)
    .onUpdate(async (event) => {
        let quality = event.after.data();
        if (quality.state == "tracing") {
            console.log("receiving request");

            let url;
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];

                let actionsForEmail = [];
                if (quality.correctiveActions.length) {
                    actionsForEmail = quality.correctiveActions.map(element => { return [element['corrective'], element['name']] });
                }

                const data =
                {
                    "type": "quality",
                    "otChild": quality.workOrder ? quality.workOrder : '-',
                    "partNumber": quality.partNumber ? quality.partNumber : '-',
                    "workshop": quality.workShop ? quality.workShop : '-',
                    "details": quality.enventDetail ? quality.enventDetail : (quality.question1 + '. ' +
                        quality.question2 + '. ' +
                        quality.question3 + '. ' +
                        quality.question4),
                    "riskLevel": quality.evaluationAnalysisName + '(' + quality.evaluationAnalisis + ')',
                    "eventType": quality.eventType ? quality.eventType : '-',
                    "quality": quality.analysisQuality ? quality.analysisQuality : '-',
                    "failRoot": quality.analysis.causeFailure ? quality.analysis.causeFailure : '---',
                    "process": quality.analysis.process ? quality.analysis.process : '---',
                    "observations": quality.analysis.observation ? quality.analysis.observation : '---',
                    "correctiveActions": actionsForEmail,
                    "detailImages": quality.detailImages ? quality.detailImages.join('@@') : '',
                    "generalImages": quality.generalImages ? quality.generalImages.join('@@') : '',
                    "emailList": quality.emailList.toString()
                }

                const options = {
                    "method": "POST",
                    "url": url,
                    "port": null,
                    "headers": {
                        "authorization": `*`,
                        "content-type": "application/json"
                    },
                    data: data
                };

                console.log("Just before sending email: ", data)

                return gaxios.request(options)
                    .then(res2 => {
                        console.log(`✉️ Quality data sent!`)
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
            });


        }
    }
    )