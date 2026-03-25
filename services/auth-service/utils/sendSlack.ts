import axios from 'axios';

/**
 * 🛰️ SOVEREIGN SLACK DISPATCHER
 * Automatically sends notifications to the Slack Webhook stored in environment variables.
 */
export const sendSlackNotification = async (message: string, type: 'info' | 'error' | 'alert' = 'info') => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    // Skip if no URL is found (e.g. during local testing without Vault)
    if (!webhookUrl) {
        console.warn("⚠️ Slack Webhook URL not found in environment. Skipping notification.");
        return;
    }

    // Set aesthetics based on notification type
    const color = type === 'error' ? '#FF0000' : type === 'alert' ? '#FFA500' : '#36a64f';
    const emoji = type === 'error' ? '🚨' : type === 'alert' ? '⚠️' : '✅';

    try {
        await axios.post(webhookUrl, {
            attachments: [{
                color: color,
                title: `${emoji} Sovereign System Notification`,
                text: message,
                fields: [
                    {
                        title: "Environment",
                        value: process.env.NODE_ENV || 'development',
                        short: true
                    },
                    {
                        title: "Service",
                        value: "sovereign-backend",
                        short: true
                    }
                ],
                footer: "Elite Enterprise Engine | " + new Date().toLocaleString(),
            }]
        });
        console.log("📡 Slack notification dispatched successfully to channel.");
    } catch (error: any) {
        console.error("❌ Failed to send Slack notification:", error.message);
    }
};

export default sendSlackNotification;
