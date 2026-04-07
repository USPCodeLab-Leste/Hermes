import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.BASE_URL;

const IMG_URL = "https://i.ibb.co/twygqLLZ/logo-pequena-padding.png";

export async function sendVerificationEmail(userEmail,token) {

    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "Sistema Hermes <no-reply@portalhermes.app>",
        to: userEmail,
        subject: "Ative sua conta no Hermes",
        html: `
        <div style="margin:0; padding:0; background-color:#373358; font-family: 'Montserrat', Arial, system-ui, sans-serif";>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Card -->
                <table width="100%" max-width="500px" style="background-color:#494266; border-radius:16px; padding:30px; text-align:center;">

                <!-- Logo -->
                <tr>
                    <td style="padding-bottom: 10px;">
                    <img 
                        src="${IMG_URL}"
                        alt="Logo Hermes"
                        width="180"
                        style="display:block; margin:0 auto;"
                    />
                    </td>
                </tr>
                
                <!-- Logo / Título -->
                <tr>
                    <td>
                    <h1 style="color:#F4F3F8; margin-bottom:10px;">
                        Portal Hermes
                    </h1>
                    <p style="color:#B8B5D6; font-size:14px;">
                        Confirme seu e-mail para começar
                    </p>
                    </td>
                </tr>

                <!-- Espaço -->
                <tr><td height="20"></td></tr>

                <!-- Texto -->
                <tr>
                    <td>
                    <p style="color:#E0DEF4; font-size:16px; line-height:1.5; display: inline-block; max-width: 380px;">
                        Estamos quase lá! Clique no botão abaixo para verificar seu e-mail e acessar a plataforma.
                    </p>
                    </td>
                </tr>

                <!-- Espaço -->
                <tr><td height="10"></td></tr>

                <!-- Botão -->
                <tr>
                    <td>
                    <a href="${verificationLink}"
                        style="
                        background: #5FA9C9;
                        color: #F4F3F8;
                        padding: 14px 28px;
                        text-decoration: none;
                        border-radius: 12px;
                        font-weight: bold;
                        display: inline-block;
                        font-size: 16px;
                        ">
                        Verificar E-mail
                    </a>
                    </td>
                </tr>

                <!-- Espaço -->
                <tr><td height="30"></td></tr>

                <!-- Link alternativo -->
                <tr>
                    <td>
                    <p style="color:#B8B5D6; font-size:13px;">
                        Se o botão não funcionar, copie e cole o link abaixo no navegador:
                    </p>
                    <p style="color:#5BC0EB; word-break: break-all; font-size:10px;">
                        ${verificationLink}
                    </p>
                    </td>
                </tr>

                </table>

                <!-- Rodapé -->
                <table width="100%" max-width="500px" style="margin-top:20px; text-align:center;">
                <tr>
                    <td>
                    <p style="color:#8E8AAE; font-size:12px;">
                        Feito com 🩷🤍 por USP CodeLab Leste
                    </p>
                    </td>
                </tr>
                </table>

            </td>
            </tr>
        </table>
        </div>
        `
    });

    if (error) {
        console.error("Erro ao enviar email:", error);
        throw error;
    }

    console.log("Email enviado. ID:", data?.id);

}