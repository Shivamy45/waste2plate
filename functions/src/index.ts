import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const autoExpireFoodAlerts = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    try {
      // Get all active alerts older than 2 hours
      const expiredAlerts = await db
        .collection('food_alerts')
        .where('status', '==', 'active')
        .where('createdAt', '<', twoHoursAgo)
        .get();

      if (expiredAlerts.empty) {
        console.log('No alerts to expire');
        return null;
      }

      const batch = db.batch();
      const messaging = admin.messaging();

      for (const alertDoc of expiredAlerts.docs) {
        const alertData = alertDoc.data();
        
        // Update alert status to expired
        batch.update(alertDoc.ref, {
          status: 'expired',
          expiredAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Notify users who claimed this alert
        if (alertData.claimedBy && alertData.claimedBy.length > 0) {
          const notification = {
            title: 'Food Alert Expired',
            body: `The food alert "${alertData.title}" has expired.`,
            data: {
              type: 'alert_expired',
              alertId: alertDoc.id
            }
          };

          // Get FCM tokens for all users who claimed this alert
          const userTokens = await Promise.all(
            alertData.claimedBy.map(async (userId: string) => {
              const userDoc = await db.collection('users').doc(userId).get();
              return userDoc.data()?.fcmToken;
            })
          );

          // Send notifications to all valid tokens
          const validTokens = userTokens.filter(token => token);
          if (validTokens.length > 0) {
            await messaging.sendMulticast({
              tokens: validTokens,
              notification
            });
          }
        }
      }

      await batch.commit();
      console.log(`Expired ${expiredAlerts.size} alerts`);
      return null;
    } catch (error) {
      console.error('Error in autoExpireFoodAlerts:', error);
      return null;
    }
  }); 