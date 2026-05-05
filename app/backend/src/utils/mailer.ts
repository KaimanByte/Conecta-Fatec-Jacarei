import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuração flexível: Prioriza variáveis de ambiente (Produção)
// Se não houver, usa Ethereal (Desenvolvimento)
const isProd = process.env.NODE_ENV === 'production' || process.env.SMTP_HOST;

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

// Função para inicializar o mailer
export async function initMailer() {
  if (!isProd) {
    // Modo Desenvolvimento: Gera conta Ethereal automaticamente se não houver credenciais
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('📧 Mailer em modo DESENVOLVIMENTO (Ethereal):');
    console.log(' - User:', testAccount.user);
    console.log(' - Pass:', testAccount.pass);
  } else {
    console.log('📧 Mailer em modo PRODUÇÃO configurado para:', process.env.SMTP_HOST);
    
    // Verificar conexão em produção
    try {
      await transporter.verify();
      console.log('✅ Conexão SMTP estabelecida com sucesso!');
    } catch (error) {
      console.error('❌ Falha na conexão SMTP de produção:', error);
    }
  }
}

export async function sendAnswerEmail(to: string, studentName: string, question: string, answer: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Secretaria Acadêmica Fatec" <secretaria@fatec.edu>',
      to,
      subject: 'Resposta à sua dúvida acadêmica',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Olá, ${studentName}!</h2>
          <p>Sua dúvida enviada através do nosso autoatendimento foi respondida pela secretaria.</p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">SUA PERGUNTA:</p>
            <p style="font-style: italic; color: #4b5563;">"${question}"</p>
          </div>

          <div style="background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <p style="font-size: 12px; color: #4338ca; margin-bottom: 5px; font-weight: bold;">RESPOSTA DA SECRETARIA:</p>
            <p style="color: #1e1b4b; font-weight: 500;">${answer}</p>
          </div>

          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
            Este é um e-mail automático. Por favor, não responda.
          </p>
        </div>
      `
    });

    if (!isProd) {
      console.log('✉️ Visualizar e-mail de teste:', nodemailer.getTestMessageUrl(info));
    } else {
      console.log('✉️ E-mail enviado para:', to);
    }
    
    return info;
  } catch (error) {
    console.error('❌ Erro gravíssimo ao enviar e-mail:', error);
    throw error;
  }
}
