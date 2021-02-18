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
    const createdAt= new Date();
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

