/**
 * Email Service - ส่งอีเมลผ่าน Nodemailer
 * รองรับ Gmail, Outlook, และ SMTP อื่นๆ
 */

import nodemailer from 'nodemailer';

// สร้าง transporter
const createTransporter = () => {
    // ใช้ Gmail (แนะนำ)
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,     // อีเมลของคุณ
            pass: process.env.EMAIL_PASSWORD, // App Password (ไม่ใช่รหัสผ่านปกติ)
        },
    });

    // หรือใช้ SMTP อื่นๆ
    // return nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
};

/**
 * ส่งอีเมลรีเซ็ตรหัสผ่าน
 */
export async function sendPasswordResetEmail(email, resetToken) {
    try {
        const transporter = createTransporter();

        // สร้าง reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        // HTML template สำหรับอีเมล
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 12px;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 รีเซ็ตรหัสผ่าน</h1>
          </div>
          <div class="content">
            <p>สวัสดีครับ,</p>
            <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ</p>
            <p>กรุณาคลิกปุ่มด้านล่างเพื่อรีเซ็ตรหัสผ่าน:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">รีเซ็ตรหัสผ่าน</a>
            </div>

            <div class="warning">
              <strong>⚠️ หมายเหตุ:</strong>
              <ul>
                <li>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</li>
                <li>หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้</li>
              </ul>
            </div>

            <p>หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
              ${resetLink}
            </p>
          </div>
          <div class="footer">
            <p>© 2026 ระบบจัดการตลาด. All rights reserved.</p>
            <p>อีเมลนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
          </div>
        </div>
      </body>
      </html>
    `;

        // ส่งอีเมล
        const info = await transporter.sendMail({
            from: `"ระบบจัดการตลาด" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 รีเซ็ตรหัสผ่านของคุณ',
            html: htmlContent,
            text: `กรุณาคลิกลิงก์นี้เพื่อรีเซ็ตรหัสผ่าน: ${resetLink}\n\nลิงก์จะหมดอายุใน 1 ชั่วโมง`,
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ส่งอีเมลยืนยันการสมัครสมาชิก
 */
export async function sendWelcomeEmail(email, name) {
    try {
        const transporter = createTransporter();

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ยินดีต้อนรับ!</h1>
          </div>
          <div class="content">
            <p>สวัสดีครับคุณ ${name},</p>
            <p>ขอบคุณที่สมัครสมาชิกกับระบบจัดการตลาดของเรา!</p>
            <p>บัญชีของคุณถูกสร้างเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันที</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">เข้าสู่ระบบ</a>
            </div>

            <p>หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อเรา</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const info = await transporter.sendMail({
            from: `"ระบบจัดการตลาด" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 ยินดีต้อนรับสู่ระบบจัดการตลาด',
            html: htmlContent,
        });

        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
}

export default {
    sendPasswordResetEmail,
    sendWelcomeEmail,
};
