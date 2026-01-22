import { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";

// SES Client configuration
let sesClient: SESClient | null = null;

const getSESClient = (): SESClient | null => {
  if (sesClient) return sesClient;

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    console.warn("⚠️ AWS SES credentials not configured - email service disabled");
    return null;
  }

  sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return sesClient;
};

// Check if SES is configured
export const isSESConfigured = (): boolean => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.SES_EMAIL_SENDER
  );
};

// Email sending options
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Send email using AWS SES
export const sendEmail = async (options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const client = getSESClient();
  const sender = process.env.SES_EMAIL_SENDER;

  if (!client || !sender) {
    return { success: false, error: "Email service not configured" };
  }

  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: options.html,
          },
          ...(options.text && {
            Text: {
              Charset: "UTF-8",
              Data: options.text,
            },
          }),
        },
        Subject: {
          Charset: "UTF-8",
          Data: options.subject,
        },
      },
      Source: sender,
    });

    const response = await client.send(command);
    console.log("✅ Email sent successfully:", response.MessageId);

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
};

// Verify an email address (for sandbox mode)
export const verifyEmailAddress = async (email: string): Promise<boolean> => {
  const client = getSESClient();
  if (!client) return false;

  try {
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
    await client.send(command);
    console.log(`📧 Verification email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send verification:", error);
    return false;
  }
};
