import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. It will expire in 1 hour.`,
        };

        await transporter.sendMail(mailOptions);
        return { status: true, message: "OTP email sent successfully." };
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
        return { status: false, message: "Failed to send OTP email." };
    }
};