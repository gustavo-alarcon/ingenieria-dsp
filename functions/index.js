const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { sendMailExample } = require('./functions/send-emails/send-mail-example');
const { createUserSetClaims } = require('./functions/auth/create-user-claims');
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