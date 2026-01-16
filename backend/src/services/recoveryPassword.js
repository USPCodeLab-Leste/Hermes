import nodemailer from "nodemailer";

export async function sendVerificationEmailRecovery(userEmail,token) {
    const testAccount = await new nodemailer.createTestAccount; // conta teste automatica ethereal

    const transporter = await new nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const verificationLink = `https://localhost:3000/auth/recovery-pass?token={token}`;
    const info = await transporter.sendMail({
        from: '"Sistema Hermes" <no-reply@hermes.com>',
        to: userEmail,
        subject: "Recupere sua senha",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Recuperação da sua senha </h2>
        <p>Clique no botão abaixo para recuperar sua senha:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
        <br><br>
        <p>Ou cole este link no navegador: <br> ${verificationLink}</p>
      </div>
    `,
    });

    console.log("Link para recuperação de senha. ID: %s", info.messageId);
    console.log("Visualize o email por aqui: %s", nodemailer.getTestMessageUrl(info));
}