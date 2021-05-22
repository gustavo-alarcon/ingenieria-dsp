const functions = require("firebase-functions");
const admin = require('firebase-admin');

const createUserSetClaims = (async (user) => {
    functions.logger.info(`create user ${user.email} ${user.uid}`, { structuredData: true });
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

module.exports = {
    createUserSetClaims
}
