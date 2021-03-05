const functions = require("firebase-functions");
const admin = require('firebase-admin');

const createUserSetClaims = (async (user) => {
    functions.logger.info(`create user ${user.email} ${user.uid}`, { structuredData: true });
    const role = 'Administrador';
    const createdAt = new Date();
    try {
        await admin.auth().setCustomUserClaims(user.uid, { role });
        return await admin.firestore().collection('users').doc(user.uid).set({
            email: user.email,
            uid: user.uid,
            name: user.displayName,
            picture: user.photoURL,
            role,
            phoneNumber: user.phoneNumber,
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
