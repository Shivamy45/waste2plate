import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import firebase from "firebase-admin"; // Import firebase-admin to use FieldValue

export async function POST(request) {
    try {
        const { uid, token } = await request.json();

        if (!uid || !token) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const db = getFirestore();
        const tokenRef = db.collection("fcm_tokens").doc(uid);

        // Add the new token to an array of tokens
        await tokenRef.update({
            tokens: firebase.firestore.FieldValue.arrayUnion(token),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error storing FCM token:", error);
        return NextResponse.json(
            { error: "Failed to store FCM token" },
            { status: 500 }
        );
    }
}