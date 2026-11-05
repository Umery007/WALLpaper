import env from "../config/env.js";

/**
 * Envio de e-mail.
 *
 * Em desenvolvimento nao existe servidor SMTP configurado, entao o link de
 * recuperacao e impresso no console do backend -- basta copiar do terminal.
 * Para producao, troque o corpo de sendMail por um provedor real
 * (Resend, SendGrid, Amazon SES, Nodemailer com SMTP...).
 */
export async function sendMail({ to, subject, text }) {
  console.log("\n" + "=".repeat(68));
  console.log("[email] Para:    ", to);
  console.log("[email] Assunto: ", subject);
  console.log("-".repeat(68));
  console.log(text);
  console.log("=".repeat(68) + "\n");
  return { delivered: false, logged: true };
}

export async function sendPasswordResetEmail(user, token) {
  const link = `${env.frontendUrl}/resetar-senha?token=${encodeURIComponent(token)}`;
  await sendMail({
    to: user.email,
    subject: "Recuperacao de senha - WA1PAPER",
    text: [
      `Ola, ${user.name}!`,
      "",
      "Recebemos um pedido para redefinir a senha da sua conta WA1PAPER.",
      "Abra o link abaixo para criar uma nova senha (vale por 1 hora):",
      "",
      link,
      "",
      "Se nao foi voce quem pediu, pode ignorar esta mensagem.",
    ].join("\n"),
  });
  return link;
}

export async function sendEmailVerification(user, token) {
  const link = `${env.frontendUrl}/verificar-email?token=${encodeURIComponent(token)}`;
  await sendMail({
    to: user.email,
    subject: "Confirme seu e-mail - WA1PAPER",
    text: [
      `Ola, ${user.name}!`,
      "",
      "Confirme o endereco de e-mail da sua conta WA1PAPER pelo link abaixo (vale por 1 hora):",
      "",
      link,
      "",
      "Se voce nao criou esta conta, ignore esta mensagem.",
    ].join("\n"),
  });
  return link;
}
