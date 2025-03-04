// import nodemailer from "nodemailer";
// import hbs from "nodemailer-express-handlebars";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: process.env.MAILTRAP_PORT,
//     auth: {
//         user: process.env.MAIL_SENDER,
//         pass: process.env.MAIL_PASSWORD,
//     },
// });

// transporter.use(
//     "compile",
//     hbs({
//         viewEngine: {
//             extName: ".hbs",
//             partialsDir: path.resolve("./templates"),
//             layoutsDir: path.resolve("./templates"),
//             defaultLayout: "",
//         },
//         viewPath: path.resolve("./templates"),
//         extName: ".hbs",
//     })
// );

// export const sendEmail = async (to, subject, template, context) => {
//     try {
//         const mailOptions = {
//             from: process.env.MAIL_SENDER,
//             to,
//             subject,
//             template,
//             context,
//         };
//         await transporter.sendMail(mailOptions);
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// };
