import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SmartHR <noreply@smarthr.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

// Email Templates

export function getLeaveRequestEmail(employeeName: string, leaveType: string, startDate: string, endDate: string, reason: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Leave Request</h2>
        </div>
        <div class="content">
          <p>A new leave request has been submitted and requires your approval.</p>
          <div class="info">
            <p><strong>Employee:</strong> ${employeeName}</p>
            <p><strong>Leave Type:</strong> ${leaveType}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          <p>Please log in to the SmartHR system to approve or reject this request.</p>
        </div>
        <div class="footer">
          <p>This is an automated email from SmartHR. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getLeaveApprovalEmail(employeeName: string, leaveType: string, startDate: string, endDate: string, approved: boolean) {
  const status = approved ? 'Approved' : 'Rejected';
  const color = approved ? '#10B981' : '#EF4444';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${color}; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${color}; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Leave Request ${status}</h2>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>Your leave request has been <strong>${status.toLowerCase()}</strong>.</p>
          <div class="info">
            <p><strong>Leave Type:</strong> ${leaveType}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
          ${approved 
            ? '<p>Your leave has been approved. Enjoy your time off!</p>' 
            : '<p>If you have any questions regarding this decision, please contact your manager.</p>'
          }
        </div>
        <div class="footer">
          <p>This is an automated email from SmartHR. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getWelcomeEmail(firstName: string, email: string, tempPassword: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .credentials { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to SmartHR!</h2>
        </div>
        <div class="content">
          <p>Dear ${firstName},</p>
          <p>Welcome to SmartHR! Your account has been created successfully.</p>
          <div class="credentials">
            <p><strong>Your Login Credentials:</strong></p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to SmartHR</a>
        </div>
        <div class="footer">
          <p>This is an automated email from SmartHR. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getInvoiceEmail(clientName: string, invoiceNumber: string, amount: number, dueDate: string, invoiceUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
        .amount { font-size: 24px; font-weight: bold; color: #4F46E5; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Invoice</h2>
        </div>
        <div class="content">
          <p>Dear ${clientName},</p>
          <p>You have received a new invoice from SmartHR.</p>
          <div class="info">
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Amount Due:</strong> <span class="amount">$${amount.toFixed(2)}</span></p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <a href="${invoiceUrl}" class="button">View Invoice</a>
          <p>Please process the payment before the due date to avoid any late fees.</p>
        </div>
        <div class="footer">
          <p>This is an automated email from SmartHR. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
