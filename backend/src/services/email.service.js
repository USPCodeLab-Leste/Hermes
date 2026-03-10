import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.BASE_URL;

export async function sendVerificationEmail(userEmail,token) {

    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "Sistema Hermes <no-reply@hermes.kauamoreno.dev>",
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
        `
    });

    if (error) {
        console.error("Erro ao enviar email:", error);
        throw error;
    }

    console.log("Email enviado. ID:", data?.id);

}