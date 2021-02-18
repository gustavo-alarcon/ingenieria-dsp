const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.googleChatBot = functions.https.onRequest((request, response) => {
    functions.logger.info("Google Chat test!", { structuredData: true });
    response.send({
        "cards": [{
            "header": HEADER,
            "sections": [{
                "widgets": [{
                    "textParagraph": {
                        "text": response
                    }
                }]
            }]
        }]
    }
    )
});
