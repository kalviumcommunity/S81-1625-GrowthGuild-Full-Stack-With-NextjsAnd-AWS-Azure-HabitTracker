// Email Templates for HabitFlow Application

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const cardStyles = `
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
`;

const buttonStyles = `
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin: 20px 0;
`;

const footerStyles = `
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #888;
  text-align: center;
`;

// Welcome Email Template
export const welcomeEmailTemplate = (userName: string) => ({
  subject: "🎉 Welcome to HabitFlow - Let's Build Great Habits!",
  html: `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0;">🎯 HabitFlow</h1>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">Welcome aboard, ${userName}! 🚀</h2>
        
        <p style="color: #555; line-height: 1.6;">
          We're thrilled to have you join the HabitFlow community! You've taken the first step 
          towards building better habits and achieving your goals.
        </p>
        
        <div style="background: #f8f9ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">🌟 Here's what you can do:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>📊 Track your daily habits with our intuitive dashboard</li>
            <li>🎯 Set meaningful goals and monitor your progress</li>
            <li>📈 Visualize your growth with detailed analytics</li>
            <li>🔔 Get reminders to stay on track</li>
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="${buttonStyles}">
            Go to Dashboard →
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px; text-align: center;">
          Ready to start? Create your first habit and watch your progress grow!
        </p>
        
        <div style="${footerStyles}">
          <p>This email was sent by HabitFlow</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    </div>
  `,
  text: `
Welcome to HabitFlow, ${userName}!

We're thrilled to have you join our community. You've taken the first step towards building better habits.

Here's what you can do:
- Track your daily habits with our intuitive dashboard
- Set meaningful goals and monitor your progress
- Visualize your growth with detailed analytics
- Get reminders to stay on track

Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard

Happy habit building!
The HabitFlow Team
  `,
});

// Password Reset Email Template
export const passwordResetTemplate = (userName: string, resetToken: string) => ({
  subject: "🔐 Reset Your HabitFlow Password",
  html: `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0;">🎯 HabitFlow</h1>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" style="${buttonStyles}">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            ⚠️ This link will expire in 1 hour for security reasons.
          </p>
        </div>
        
        <p style="color: #888; font-size: 14px;">
          If you didn't request this password reset, you can safely ignore this email. 
          Your password will remain unchanged.
        </p>
        
        <div style="${footerStyles}">
          <p>This email was sent by HabitFlow</p>
          <p>For security, this request was received from your account.</p>
        </div>
      </div>
    </div>
  `,
  text: `
Password Reset Request

Hi ${userName},

We received a request to reset your password. Visit the link below to create a new password:

${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

The HabitFlow Team
  `,
});

// Habit Streak Notification Template
export const streakNotificationTemplate = (userName: string, habitName: string, streakDays: number) => ({
  subject: `🔥 ${streakDays} Day Streak on "${habitName}" - Keep it up!`,
  html: `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0;">🎯 HabitFlow</h1>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 80px; margin-bottom: 10px;">🔥</div>
          <h2 style="color: #333; margin: 0;">${streakDays} Day Streak!</h2>
        </div>
        
        <p style="color: #555; line-height: 1.6; text-align: center;">
          Amazing work, ${userName}! You've completed <strong>"${habitName}"</strong> 
          for ${streakDays} days in a row!
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #667eea; margin: 0; font-weight: 600;">
            ${streakDays >= 30 ? "🏆 You're a habit master!" : 
              streakDays >= 14 ? "⭐ You're building real momentum!" :
              streakDays >= 7 ? "💪 One week strong!" :
              "🌱 Great start! Keep going!"}
          </p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/habits" style="${buttonStyles}">
            View Your Progress →
          </a>
        </div>
        
        <div style="${footerStyles}">
          <p>Keep building great habits with HabitFlow!</p>
        </div>
      </div>
    </div>
  `,
  text: `
🔥 ${streakDays} Day Streak!

Amazing work, ${userName}! You've completed "${habitName}" for ${streakDays} days in a row!

Keep up the great work!

View your progress: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/habits

The HabitFlow Team
  `,
});

// Activity Alert Template
export const activityAlertTemplate = (userName: string, activityType: string, details: string) => ({
  subject: `🔔 Security Alert: ${activityType}`,
  html: `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0;">🎯 HabitFlow</h1>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">🔔 Security Alert</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          We noticed the following activity on your account:
        </p>
        
        <div style="background: #f0f0f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Activity:</strong> ${activityType}</p>
          <p style="margin: 10px 0 0 0; color: #666;">${details}</p>
        </div>
        
        <p style="color: #888; font-size: 14px;">
          If this was you, no action is needed. If you don't recognize this activity, 
          please secure your account immediately.
        </p>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings" style="${buttonStyles}">
            Review Account Settings
          </a>
        </div>
        
        <div style="${footerStyles}">
          <p>This is an automated security notification from HabitFlow</p>
        </div>
      </div>
    </div>
  `,
  text: `
Security Alert: ${activityType}

Hi ${userName},

We noticed the following activity on your account:

Activity: ${activityType}
${details}

If this was you, no action is needed. If you don't recognize this activity, please secure your account.

The HabitFlow Team
  `,
});

// Generic Notification Template
export const notificationTemplate = (userName: string, title: string, message: string, ctaText?: string, ctaUrl?: string) => ({
  subject: title,
  html: `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #667eea; margin: 0;">🎯 HabitFlow</h1>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hi ${userName},
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          ${message}
        </p>
        
        ${ctaText && ctaUrl ? `
        <div style="text-align: center;">
          <a href="${ctaUrl}" style="${buttonStyles}">
            ${ctaText}
          </a>
        </div>
        ` : ''}
        
        <div style="${footerStyles}">
          <p>This email was sent by HabitFlow</p>
        </div>
      </div>
    </div>
  `,
  text: `
${title}

Hi ${userName},

${message}

${ctaText && ctaUrl ? `${ctaText}: ${ctaUrl}` : ''}

The HabitFlow Team
  `,
});
