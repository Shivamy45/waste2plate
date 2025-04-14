import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";

export async function POST(request) {
    try {
        const { token, title, body, data } = await request.json();

        if (!token || !title || !body) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const message = {
            token,
            notification: {
                title,
                body,
            },
            data: data || {},
        };

        const messaging = getMessaging();
        await messaging.send(message);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
} 