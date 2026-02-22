import nodemailer from 'nodemailer';

const pass = process.env.SMTP_PASS;
const baseUrl = process.env.BASE_URL;

export async function sendVerificationEmail(userEmail,token) {

    const transporter = await new nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
            user: 'resend',
            pass: pass,
        },
    });

    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
    const info = await transporter.sendMail({
        from: `"Sistema Hermes" <no-reply@${baseUrl}>`,
        to: userEmail,
        subject: "Ative sua conta no Hermes",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Bem-vindo ao Hermes! </h2>
        <p>Clique no botão abaixo para confirmar seu e-mail:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
        <br><br>
        <p>Ou cole este link no navegador: <br> ${verificationLink}</p>
      </div>
    `,
    });

    console.log("Email enviado. ID: %s", info.messageId);
}