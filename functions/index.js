const functions = require("firebase-functions");
const admin = require('firebase-admin');
// const { createUserSetClaims } = require('./functions/auth/create-user-claims');
const gaxios = require('gaxios')
// const SENDGRID_APY_KEY = require('./keys.json').ferreyros_01

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
    })
});


exports.createUserSetClaims = functions.auth.user().onCreate(async (user) => {
    functions.logger.info(`create user ${user.email} ${user.uid}`, { structuredData: true });

    const userEmail = user.email.split('@');

    if ((userEmail[1] !== 'meraki-s.com' && userEmail[1] !== 'ferreyros.com.pe')) {
        functions.logger.info(`Correo ${user.email} no cumple para iniciar sesión en la plataforma`);
        admin.auth()
            .deleteUser(user.uid)
            .then(() => {
                console.log('Successfully deleted user');
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
            });
        return;
    }

    const basics = {
        superuser: false,
        admin: false,
        technician: true
    }
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    try {
        await admin.auth().setCustomUserClaims(user.uid, basics);
        return await admin.firestore().collection('users').doc(user.uid).set({
            email: user.email,
            uid: user.uid,
            name: user.displayName,
            picture: user.photoURL,
            phoneNumber: user.phoneNumber,
            role: 'Técnico',
            createdAt
        }, { merge: true });
    } catch (error) {
        functions.logger.info(error, { structuredData: true });
        return;
    }
});

exports.setClaimsAsTechnician = functions.https.onCall(async (data, context) => {
    functions.logger.info(`User ${data.uid} claims updated`, { structuredData: true });
    const uid = data.uid;
    const roles = {
        superuser: false,
        admin: false,
        technician: true
    }

    try {
        await admin.auth().setCustomUserClaims(uid, roles);
        await admin.firestore().collection('users').doc(uid).update({
            role: 'Técnico',
            editedAt: admin.firestore.FieldValue.serverTimestamp(),
            editedBy: context.auth.token.name
        });

        await admin
            .auth()
            .revokeRefreshTokens(uid)
            .then(() => {
                return admin.auth().getUser(uid);
            })
            .then((userRecord) => {
                return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
            })
            .then((timestamp) => {
                console.log(`Tokens revoked at: ${timestamp}`);
            });

        return 'Claims updated';

    } catch (error) {
        functions.logger.info(error, { structuredData: true });
        return;
    }
});

exports.setClaimsAsAdministrator = functions.https.onCall(async (data, context) => {
    functions.logger.info(`User ${data.uid} claims updated`, { structuredData: true });
    const uid = data.uid;
    const roles = {
        superuser: false,
        admin: true,
        technician: false
    }

    try {
        await admin.auth().setCustomUserClaims(uid, roles);
        await admin.firestore().collection('users').doc(uid).update({
            role: 'Administrador',
            editedAt: admin.firestore.FieldValue.serverTimestamp(),
            editedBy: context.auth.token.name
        });

        await admin
            .auth()
            .revokeRefreshTokens(uid)
            .then(() => {
                return admin.auth().getUser(uid);
            })
            .then((userRecord) => {
                return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
            })
            .then((timestamp) => {
                console.log(`Tokens revoked at: ${timestamp}`);
            });

        return 'Claims updated';

    } catch (error) {
        functions.logger.info(error, { structuredData: true });
        return;
    }
});

exports.setClaimsAsSuperuser = functions.https.onCall(async (data, context) => {
    functions.logger.info(`User ${data.uid} claims updated`, { structuredData: true });
    const uid = data.uid;
    const roles = {
        superuser: true,
        admin: false,
        technician: false
    }

    try {
        await admin.auth().setCustomUserClaims(uid, roles);
        await admin.firestore().collection('users').doc(uid).update({
            role: 'Super Usuario',
            editedAt: admin.firestore.FieldValue.serverTimestamp(),
            editedBy: context.auth.token.name
        });

        await admin
            .auth()
            .revokeRefreshTokens(uid)
            .then(() => {
                return admin.auth().getUser(uid);
            })
            .then((userRecord) => {
                return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
            })
            .then((timestamp) => {
                console.log(`Tokens revoked at: ${timestamp}`);
            });

        return 'Claims updated';

    } catch (error) {
        functions.logger.info(error, { structuredData: true });
        return;
    }
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

exports.alertAndonsOpen60minutes = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {

    functions.logger.info({ log: 'alertAndoneOpen60minutes!' }, { structuredData: true });
    const andon = await admin.firestore().collection('db/ferreyros/andon');
    const snapshot = await andon.where('state', '==', 'stopped').get();
    if (snapshot.empty) {
        console.log('no matching documents andons');
        return;
    }
    let url;
    admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
        url = val.data()['endpoint'];
        snapshot.forEach((doc) => {
            const andon = doc.data();
            const data = {
                "id": andon.id,
                "type": "andon",
                "otChild": andon.otChild,
                "bay": andon.name,
                "problemType": andon.problemType,
                "description": andon.description,
                "emailList": andon.emailList.toString(),
                "images": Object.values(andon.images).length > 0 ? Object.values(andon.images).join('@@') : ''
            };

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

            gaxios.request(options)
                .then(res2 => {
                    console.log(`✉️ Andon data sent!`);
                })
                .catch(error => {
                    console.log("Error: ");
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
                });
        });
    });
    return;
});

exports.sendAndonToEndpoint = functions.firestore.document(`db/ferreyros/andon/{andonId}`)
    .onWrite(async (event) => {
        const andon = event.after.data();
        let url;
        await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
            url = val.data()['endpoint'];

            const data = {
                "id": andon.id,
                "type": "andon",
                "otChild": andon.otChild,
                "bay": andon.name,
                "problemType": andon.problemType,
                "description": andon.description,
                "emailList": andon.emailList.toString(),
                "images": Object.values(andon.images).length > 0 ? Object.values(andon.images).join('@@') : ''
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
    });

exports.updateSendAndonToEndpoint = functions.firestore.document(`db/ferreyros/andon/{andonId}`)
    .onUpdate(async (event) => {
        const andon = event.after.data();
        let url;

        if (andon.reassignedAt) {
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];
                const data = {
                    "id": andon.id,
                    "type": "andon",
                    "otChild": andon.otChild,
                    "bay": andon.name,
                    "problemType": andon.problemType,
                    "description": andon.description,
                    "emailList": andon.emailList.toString(),
                    "images": Object.values(andon.images).length > 0 ? Object.values(andon.images).join('@@') : ''
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

        }

    });

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

                const data = {
                    "id": eval.id,
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
                    "images": [eval.resultImage1, eval.resultImage2].join('@@'),
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
    });

exports.sendQualityToEndpoint = functions.firestore.document(`db/ferreyros/quality/{qualityId}`)
    .onUpdate(async (event) => {
        let quality = event.after.data();
        if (quality.state == "process") {
            console.log("receiving request");

            let url;
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];

                let actionsForEmail = [];
                if (quality.correctiveActions.length) {
                    actionsForEmail = quality.correctiveActions.map(element => { return [element['corrective'], element['name']] });
                }

                const data = {
                    "id": quality.id,
                    "type": "quality process",
                    "otChild": quality.workOrder ? quality.workOrder : '-',
                    "partNumber": quality.partNumber ? quality.partNumber : '-',
                    "workshop": quality.workShop ? quality.workShop : '-',
                    "analysisQuality": quality.analysisQuality ? quality.analysisQuality : '',
                    "analysisCost": quality.analysisCost ? quality.analysisCost : '',
                    "analysisFrequency": quality.analysisFrequency ? quality.analysisFrequency : '',
                    "specialist": quality.specialist ? quality.specialist : '',
                    "details": quality.enventDetail ? quality.enventDetail : (quality.question1 + '. ' +
                        quality.question2 + '. ' +
                        quality.question3 + '. ' +
                        quality.question4),
                    "riskLevel": quality.evaluationAnalysisName + '(' + quality.evaluationAnalisis + ')',
                    "eventType": quality.eventType ? quality.eventType : '-',
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

        if (quality.state == "tracing") {
            console.log("receiving request");

            let url;
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];

                let actionsForEmail = [];
                if (quality.correctiveActions.length) {
                    actionsForEmail = quality.correctiveActions.map(element => { return [element['corrective'], element['name']] });
                }

                const data = {
                    "id": quality.id,
                    "type": "quality",
                    "otChild": quality.workOrder ? quality.workOrder : '-',
                    "partNumber": quality.partNumber ? quality.partNumber : '-',
                    "workshop": quality.workShop ? quality.workShop : '-',
                    "reportingWorkshop": quality.reportingWorkshop ? quality.reportingWorkshop : '-',
                    "details": quality.enventDetail ? quality.enventDetail : (quality.question1 + '. ' +
                        quality.question2 + '. ' +
                        quality.question3 + '. ' +
                        quality.question4),
                    "riskLevel": quality.evaluationAnalysisName + '(' + quality.evaluationAnalisis + ')',
                    "eventType": quality.eventType ? quality.eventType : '-',
                    "quality": quality.analysisQuality ? quality.analysisQuality : '-',
                    "failRoot": quality.analysis.causeFailure ? quality.analysis.causeFailure : '---',
                    "basicCause": quality.analysis.basicCause ? quality.analysis.basicCause : '---',
                    "process": quality.analysis.process ? quality.analysis.process : '---',
                    "responsable": quality.analysis.responsable ? quality.analysis.responsable : '---',
                    "bahia": quality.analysis.bahia ? quality.analysis.bahia : '---',
                    "URLimages": quality.analysis.URLimage ? quality.analysis.URLimage : '---',
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
    });


exports.sendQualityOnCreate = functions.firestore.document(`db/ferreyros/quality/{qualityId}`)
    .onCreate(async (event) => {
        const quality = event.data();

        let url;
        await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
            url = val.data()['endpoint'];

            const data = {
                "id": quality.id,
                "type": "quality creation",
                "otChild": quality.workOrder ? quality.workOrder : '',
                "partNumber": quality.partNumber ? quality.partNumber : '',
                "component": quality.component ? quality.component : '',
                "paralized": quality.paralized ? quality.paralized : false, // boolean
                "workshop": quality.workShop ? quality.workShop : '', //taller responsable
                "reportingWorkshop": quality.reportingWorkshop ? quality.reportingWorkshop.workshopName : '', //taller que reporta

                "packageNumber": quality.packageNumber ? quality.packageNumber : '',
                "horometer": quality.componentHourMeter ? quality.componentHourMeter : '',
                "miningOperation": quality.miningOperation ? quality.miningOperation : '',

                "details": quality.enventDetail ? quality.enventDetail : (quality.question1 + '. ' +
                    quality.question2 + '. ' +
                    quality.question3 + '. ' +
                    quality.question4),
                "eventType": quality.eventType ? quality.eventType : '',
                "process": quality.reportingWorkshopProcess ? quality.reportingWorkshopProcess : '',
                "detailImages": quality.detailImages ? quality.detailImages.join('@@') : '',
                "generalImages": quality.generalImages ? quality.generalImages.join('@@') : '',
                "createdByEmail": quality.createdBy ? quality.createdBy.email : ''
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
                    console.log(`✉️ Quality create sent!`)
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
    });


exports.sendBudget = functions.https.onCall(async (data, context) => {

    console.log(data);
    let url;
    await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
        url = val.data()['endpoint'];

        const emailData = {
            "id": data.id,
            "type": "budget",
            "budgetFiles": data.budgetFiles ? data.budgetFiles.join('@@') : '',
            "reportFiles": data.reportFiles ? data.reportFiles.join('@@') : '',
            "quotationFiles": data.quotationFiles ? data.quotationFiles.join('@@') : '',
            "subject": data.subject ? data.subject : '',
            "body": data.body ? data.body : '',
            "observations": data.observations ? data.observations : '',
            "emailList": data.emailList.toString(),
            "workOrder": data.workOrder ? data.workOrder : '',
            "workshop": data.workshop ? data.workshop : '',
        }

        const options = {
            "method": "POST",
            "url": url,
            "port": null,
            "headers": {
                "authorization": `*`,
                "content-type": "application/json"
            },
            data: emailData
        };

        console.log("Just before sending email: ", emailData);

        return gaxios.request(options)
            .then(res2 => {
                console.log(`✉️ Budget data sent!`)
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
});

exports.sendLowFrequency = functions.firestore.document(`db/ferreyros/reviewHistory/{reviewId}`)
    .onCreate(async (event) => {
        const review = event.data();

        if (review.hasLowFrequency) {
            let url;
            await admin.firestore().doc('/db/generalConfig').onSnapshot(val => {
                url = val.data()['endpoint'];

                const data = {
                    "id": review.id,
                    "code": "frequency",
                    "ot": review.ot ? review.ot : '',
                    "hasLowFrequency": review.workOrder ? review.workOrder : '',
                    "spareParts": review.spareParts ? review.spareParts.map(spare => spare.partNumber).join("@@") : '',
                    "descriptions": review.descriptions ? review.descriptions.map(desc => desc.description).join("@@") : '',
                    "createdByEmail": review.createdBy ? review.createdBy.email : '',
                    "createdAt": review.createdAt ? review.createdAt : '',
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
                        console.log(`✉️ Frequency notification sent!`)
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
        
    });