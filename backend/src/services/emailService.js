const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[AVISO] Configurações de SMTP não preenchidas no .env. O envio de e-mails ficará desativado até a configuração.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: user,
      pass: pass,
    },
  });

  return transporter;
}

/**
 * Envia o e-mail de comprovação com carimbo eletrônico de autenticidade para o servidor
 * e notifica a Seção Técnica de Gestão de Pessoas (STGP).
 * 
 * @param {Object} dados - Informações da declaração e do servidor
 */
async function enviarComprovantesEmail(dados) {
  const mailer = getTransporter();
  if (!mailer) {
    console.log(`[SIMULAÇÃO E-MAIL] Declaração ${dados.codigoAutenticidade} registrada (SMTP desligado).`);
    return { enviado: false, motivo: 'SMTP não configurado' };
  }

  const from = process.env.SMTP_FROM || '"STGP - FCT UNESP" <rh.fct@unesp.br>';
  const emailServidor = dados.email;
  const emailSTGP = process.env.EMAIL_NOTIFICACAO_STGP || 'rh.fct@unesp.br';

  const assunto = `[STGP Digital] Comprovante de Declaração de Dependentes - ${dados.codigoAutenticidade}`;

  const htmlCorpo = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px; background-color: #f4f6f8; }
      .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e8ed; overflow: hidden; }
      .header { background-color: #00a3e3; color: #ffffff; padding: 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 20px; font-weight: bold; }
      .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.9; }
      .content { padding: 25px; }
      .protocolo-box { background: #f0f9fd; border: 2px dashed #00a3e3; border-radius: 6px; padding: 15px; text-align: center; margin: 20px 0; }
      .protocolo-cod { font-size: 22px; font-weight: bold; color: #0077a8; letter-spacing: 1px; }
      .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      .info-table td { padding: 8px 10px; border-bottom: 1px solid #eeeeee; font-size: 14px; }
      .info-table td.label { font-weight: bold; width: 35%; color: #555; }
      .footer { background: #1b303b; color: #ffffff; padding: 15px; text-align: center; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>STGP Digital — FCT UNESP</h1>
        <p>Declaração de Dependentes (Encargos de Família)</p>
      </div>
      <div class="content">
        <p>Prezado(a) <strong>${dados.nome}</strong>,</p>
        <p>Confirmamos o recebimento eletrônico de sua <strong>${dados.tipoDeclaracao}</strong> junto à Seção Técnica de Gestão de Pessoas da FCT UNESP.</p>
        
        <div class="protocolo-box">
          <div style="font-size: 13px; color: #555; text-transform: uppercase;">Código de Autenticidade / Protocolo:</div>
          <div class="protocolo-cod">${dados.codigoAutenticidade}</div>
          <div style="font-size: 12px; color: #777; margin-top: 4px;">Data/Hora: ${dados.dataHoraFormatada}</div>
        </div>

        <table class="info-table">
          <tr><td class="label">Servidor(a):</td><td>${dados.nome}</td></tr>
          <tr><td class="label">CPF:</td><td>${dados.cpf}</td></tr>
          <tr><td class="label">E-mail:</td><td>${dados.email}</td></tr>
          <tr><td class="label">Tipo de Declaração:</td><td>${dados.tipoDeclaracao}</td></tr>
          <tr><td class="label">Qtd. Dependentes:</td><td>${dados.qtdDependentes}</td></tr>
          <tr><td class="label">Hash Criptográfico:</td><td style="font-family: monospace; font-size: 11px;">${dados.hashAutenticidade}</td></tr>
        </table>

        <p style="margin-top: 25px; font-size: 13px; color: #666;">
          Este documento possui validade institucional e foi registrado em conformidade com as diretrizes do Câmpus de Presidente Prudente.
        </p>
      </div>
      <div class="footer">
        Faculdade de Ciências e Tecnologia — Câmpus de Presidente Prudente / UNESP<br>
        Seção Técnica de Gestão de Pessoas (STGP) — rh.fct@unesp.br
      </div>
    </div>
  </body>
  </html>
  `;

  // 1. Envio para o servidor
  await mailer.sendMail({
    from: from,
    to: emailServidor,
    subject: assunto,
    html: htmlCorpo,
  });

  // 2. Notificação para a STGP
  await mailer.sendMail({
    from: from,
    to: emailSTGP,
    subject: `[Novo Envio] Declaração de Dependentes - ${dados.nome} (${dados.codigoAutenticidade})`,
    html: htmlCorpo,
  });

  return { enviado: true };
}

module.exports = {
  enviarComprovantesEmail,
};
