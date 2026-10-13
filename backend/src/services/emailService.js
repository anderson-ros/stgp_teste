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

  // Formatação de data
  let dataTransmissao = dados.dataHoraFormatada || dados.dataHora || '';
  if (dataTransmissao && dataTransmissao.includes(' ')) {
    const [d, h] = dataTransmissao.split(' ');
    dataTransmissao = `${d} às ${h.substring(0, 5)}`;
  }

  const dependentes = Array.isArray(dados.dependentes) ? dados.dependentes : [];
  let secaoDependentesHtml = '';

  if (dados.possuiDependentes && dependentes.length > 0) {
    let linhasTabela = '';
    for (const dep of dependentes) {
      const nomeOficial = dep.nome || 'Não informado';
      const nomeSecundario = dep.nomeAbreviado || dep.nome || '';
      const htmlNome = `<div style="font-weight: bold; color: #0f172a;">${nomeOficial}</div>` +
        (nomeSecundario ? `<div style="color: #64748b; font-size: 11px; margin-top: 3px; text-transform: uppercase;">(${nomeSecundario.toUpperCase()})</div>` : '');

      const htmlCpf = dep.cpf || '-';

      const parentescoStr = dep.parentesco || '-';
      const resp = (dep.responsabilidade || '').trim();
      let htmlParentesco = `<div>${parentescoStr}</div>`;
      if (resp && resp !== '-' && !/^n[aã]o/i.test(resp)) {
        htmlParentesco += `<div style="color: #475569; font-size: 12px; margin-top: 2px;">(${resp})</div>`;
      }

      const nascStr = dep.nascimento || dep.dataNascimento || '-';
      let idadeStr = dep.idade || '';
      if (!idadeStr && nascStr && nascStr !== '-') {
        const partes = nascStr.split('/');
        if (partes.length === 3) {
          const dtNasc = new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
          const hoje = new Date();
          let anos = hoje.getFullYear() - dtNasc.getFullYear();
          const m = hoje.getMonth() - dtNasc.getMonth();
          if (m < 0 || (m === 0 && hoje.getDate() < dtNasc.getDate())) anos--;
          idadeStr = `${anos} anos`;
        }
      } else if (idadeStr && !/ano/i.test(idadeStr)) {
        idadeStr = `${idadeStr} anos`;
      }
      const htmlNascIdade = nascStr + (idadeStr ? ` (${idadeStr})` : '');

      let fins = dep.finalidades || [];
      if (!Array.isArray(fins)) fins = [fins];
      const rotulos = fins.map(f => {
        const str = (f || '').toString().trim();
        if (/imposto/i.test(str) || /irrf/i.test(str)) return 'IRRF';
        if (/sal[aá]rio/i.test(str)) return 'Salário-Família';
        if (/plano/i.test(str) || /sa[uú]de/i.test(str)) return 'Plano Saúde';
        if (/incapacitado/i.test(str)) return 'Incapacitado p/ Trabalho';
        return str;
      });
      const htmlFinalidades = rotulos.length > 0 ? rotulos.join(', ') : '-';

      linhasTabela += `
        <tr style="background-color: #ffffff; border: 1px solid #cbd5e1;">
          <td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">${htmlNome}</td>
          <td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1; white-space: nowrap;">${htmlCpf}</td>
          <td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">${htmlParentesco}</td>
          <td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1; white-space: nowrap;">${htmlNascIdade}</td>
          <td style="padding: 10px 12px; vertical-align: top; border: 1px solid #cbd5e1;">${htmlFinalidades}</td>
        </tr>`;
    }

    secaoDependentesHtml = `
      <h3 style="color: #0055a5; font-size: 16px; font-weight: bold; margin: 24px 0 12px 0;">Dependentes Declarados (${dependentes.length}):</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 22px; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #004b87; color: #ffffff;">
            <th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Nome</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">CPF</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Parentesco</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Nascimento/<br>Idade</th>
            <th style="padding: 10px 12px; text-align: left; font-weight: bold; border: 1px solid #003a6b;">Finalidades</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>`;
  } else {
    secaoDependentesHtml = `
      <h3 style="color: #0055a5; font-size: 16px; font-weight: bold; margin: 24px 0 12px 0;">Declaração Negativa de Dependentes:</h3>
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px 18px; color: #334155; font-size: 13px; line-height: 1.6;">
        O(a) servidor(a) declarou sob as penas da lei que <strong style="color: #ea580c;">NÃO POSSUI DEPENDENTES</strong> para fins de dedução do Imposto de Renda Retido na Fonte (IRRF), percepção de Salário-Família ou vinculação a Plano de Saúde Privado junto à UNESP.
      </div>`;
  }

  const htmlCorpo = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;">
    <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e8ed; overflow: hidden;">
      <div style="background-color: #004b87; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.01em;">STGP Digital — FCT UNESP</h1>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.95;">Comprovante de Declaração de Dependentes (Encargos de Família)</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p style="margin-top: 0;">Prezado(a) <strong>${dados.nome}</strong>,</p>
        <p>Confirmamos o recebimento e o registro eletrônico de sua <strong>${dados.tipoDeclaracao}</strong> junto à Seção Técnica de Gestão de Pessoas da FCT UNESP.</p>
        
        <div style="background: #f0f9fd; border: 2px dashed #00a3e3; border-radius: 6px; padding: 14px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Código de Autenticidade / Protocolo:</div>
          <div style="font-size: 20px; font-weight: bold; color: #0077a8; letter-spacing: 1px; margin-top: 3px;">${dados.codigoAutenticidade}</div>
        </div>

        <!-- Bloco Superior de Identificação do Servidor (Conforme Print Oficial) -->
        <div style="background-color: #f0f7fc; border-left: 4px solid #0055a5; padding: 14px 18px; margin: 18px 0 22px 0; font-size: 14px; line-height: 1.7; color: #1e293b;">
          <div><strong>Servidor(a) Declarante:</strong> ${dados.nome}</div>
          <div><strong>E-mail Institucional:</strong> ${dados.email}</div>
          <div><strong>CPF:</strong> ${dados.cpf}</div>
          <div><strong>Estado Civil:</strong> ${dados.estadoCivil || '-'}</div>
          <div><strong>Data e Hora de Transmissão:</strong> ${dataTransmissao}</div>
        </div>

        <!-- Seção de Dependentes Declarados (Tabela Oficial) -->
        ${secaoDependentesHtml}

        <!-- Bloco de Autenticidade Criptográfica SHA-256 (Conforme Print Oficial) -->
        <div style="margin-top: 22px; border: 1px dashed #94a3b8; border-radius: 4px; padding: 12px 16px; background-color: #f8fafc;">
          <div style="font-weight: bold; color: #1e293b; font-size: 13px; margin-bottom: 4px;">Autenticidade Criptográfica (SHA-256):</div>
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #0f172a; word-break: break-all; letter-spacing: 0.5px;">${(dados.hashAutenticidade || '').toUpperCase()}</div>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #64748b; line-height: 1.5;">
          Este documento possui autenticidade digital conferida e arquivada nos sistemas eletrônicos da FCT UNESP.
        </p>
      </div>
      <div style="background: #1b303b; color: #ffffff; padding: 14px; text-align: center; font-size: 11px; line-height: 1.5;">
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
