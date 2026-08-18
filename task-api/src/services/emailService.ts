import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '../config/env.config';
import { logger } from '../config/logger';

const resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const createSmtpTransporter = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587', 10),
    secure: env.SMTP_PORT === '465',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async (to: string, otpCode: string): Promise<boolean> => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #172B4D; background-color: #F4F5F7; border-radius: 8px;">
      <h2 style="color: #0052CC;">Verifikasi Akun Anda</h2>
      <p>Gunakan kode OTP berikut untuk menyelesaikan pendaftaran atau verifikasi akun Anda:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0052CC; background: #FFFFFF; padding: 12px 24px; display: inline-block; border-radius: 6px; border: 1px solid #DFE1E6; margin: 16px 0;">
        ${otpCode}
      </div>
      <p style="font-size: 13px; color: #5E6C84;">Kode ini hanya berlaku selama 10 menit. Jangan berikan kode ini kepada siapapun.</p>
    </div>
  `;

  // 1. Opsi Utama: Gunakan Resend API jika API Key tersedia
  if (resendClient && process.env.NODE_ENV !== 'test') {
    try {
      const response = await resendClient.emails.send({
        from: env.RESEND_FROM || 'onboarding@resend.dev',
        to: [to],
        subject: 'Kode Verifikasi OTP - Task Management System',
        html: htmlContent,
      });

      if (response.error) {
        logger.error(`[Resend Error] Gagal mengirim OTP ke ${to}:`, response.error);
        return false;
      }

      logger.info(`[Resend Success] Kode OTP berhasil dikirim ke ${to} (ID: ${response.data?.id})`);
      return true;
    } catch (error) {
      logger.error(`[Resend Exception] Error sending OTP email to ${to}:`, error);
      return false;
    }
  }

  // 2. Opsi Fallback: Gunakan Nodemailer SMTP jika diset
  const transporter = createSmtpTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.SMTP_FROM || `"Task Management" <${env.SMTP_USER}>`,
        to,
        subject: 'Kode Verifikasi OTP - Task Management System',
        html: htmlContent,
      });
      logger.info(`[SMTP Success] Email OTP berhasil dikirim ke ${to}`);
      return true;
    } catch (error) {
      logger.error(`[SMTP Error] Gagal mengirim email OTP ke ${to}:`, error);
      return false;
    }
  }

  logger.warn(`[EmailService] Neither RESEND_API_KEY nor SMTP is configured. OTP code [${otpCode}] for ${to} not sent via email.`);
  return false;
};
