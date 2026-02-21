import transporter from './emailService.js';

const sendEmailFun = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"TechBytes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    throw error;
  }
};

export default sendEmailFun;