/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.updateFoodAlertStatus = functions.pubsub
	.schedule("every 10 minutes")
	.onRun(async (context) => {
		const now = new Date();

		try {
			const snapshot = await db.collection("food_alerts").get();

			let batch = db.batch();

			snapshot.forEach((doc) => {
				const data = doc.data();
				const alertTime = new Date(data.timestamp);

				let status = "available";

				if (alertTime > now) {
					status = "unavailable";
				} else if (alertTime < now) {
					status = "expired";
				}

				if (data.status !== status) {
					batch.update(doc.ref, { status });
				}
			});

			await batch.commit();
			console.log("✅ Food alert statuses updated.");
		} catch (error) {
			console.error("🔥 Error updating food alerts:", error);
		}

		return null;
	});