export const sendNotification = async (token, title, body, data = {}) => {
    try {
        const response = await fetch("/api/send-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                title,
                body,
                data,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send notification");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}; 