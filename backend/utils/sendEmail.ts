import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // For local development, intentionally log the password reset link
    console.log(`\n📧 [DEV EMAIL INTERCEPTED FOR ${options.email}]:\nSubject: ${options.subject}\nMessage: ${options.message}\n`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: Number(process.env.SMTP_PORT) || 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Sovereign Realty'} <${process.env.FROM_EMAIL || 'noreply@sovereign.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        // Only attempt to send if a password is intentionally configured
        if (process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD !== 'fake_password_123') {
            await transporter.sendMail(message);
        } else {
            console.warn("⚠️ Local environment: Real SMTP skipped. Ensure your .env has genuine credentials for production.");
        }
    } catch (err) {
        console.warn("⚠️ SMTP Service Error: Could not dispatch real email.", err);
    }
};

export { sendEmail };
