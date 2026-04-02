import { NextResponse } from "next/server";
import { sendEmail, isSESConfigured } from "@/lib/email";
import {
  welcomeEmailTemplate,
  passwordResetTemplate,
  streakNotificationTemplate,
  activityAlertTemplate,
  notificationTemplate,
} from "@/lib/emailTemplates";
import {
  detectSqliRisk,
  sanitizeEmail,
  sanitizeInput,
  sanitizeRichText,
} from "@/lib/security";

// GET - Check if email service is configured
export async function GET() {
  return NextResponse.json({
    success: true,
    configured: isSESConfigured(),
    provider: "AWS SES",
  });
}

// POST - Send an email
export async function POST(req: Request) {
  try {
    // Check if SES is configured
    if (!isSESConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service not configured. Please set AWS SES credentials.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { to, subject, message, template, templateData } = body;
    const cleanTo = sanitizeEmail(to || "");
    const cleanSubject = sanitizeInput(subject || "");
    const cleanMessage = sanitizeRichText(message || "");
    const cleanTemplate = sanitizeInput(template || "");

    if ([cleanTo, cleanSubject, cleanMessage, cleanTemplate].some((v) => v && detectSqliRisk(v))) {
      return NextResponse.json(
        { success: false, message: "Input rejected by security policy" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!cleanTo) {
      return NextResponse.json(
        { success: false, message: "Recipient email (to) is required" },
        { status: 400 }
      );
    }

    let emailContent: { subject: string; html: string; text?: string };

    // Use template if specified, otherwise use raw message
    if (cleanTemplate) {
      switch (cleanTemplate) {
        case "welcome":
          emailContent = welcomeEmailTemplate(sanitizeInput(templateData?.userName || "User"));
          break;

        case "password-reset":
          if (!templateData?.resetToken) {
            return NextResponse.json(
              { success: false, message: "Reset token required for password-reset template" },
              { status: 400 }
            );
          }
          emailContent = passwordResetTemplate(sanitizeInput(templateData?.userName || "User"), sanitizeInput(templateData.resetToken));
          break;

        case "streak":
          if (!templateData?.habitName || !templateData?.streakDays) {
            return NextResponse.json(
              { success: false, message: "habitName and streakDays required for streak template" },
              { status: 400 }
            );
          }
          emailContent = streakNotificationTemplate(sanitizeInput(templateData?.userName || "User"), sanitizeInput(templateData.habitName), templateData.streakDays);
          break;

        case "activity-alert":
          if (!templateData?.activityType || !templateData?.details) {
            return NextResponse.json(
              { success: false, message: "activityType and details required for activity-alert template" },
              { status: 400 }
            );
          }
          emailContent = activityAlertTemplate(sanitizeInput(templateData?.userName || "User"), sanitizeInput(templateData.activityType), sanitizeInput(templateData.details));
          break;

        case "notification":
          if (!templateData?.title || !templateData?.message) {
            return NextResponse.json(
              { success: false, message: "title and message required for notification template" },
              { status: 400 }
            );
          }
          emailContent = notificationTemplate(
            sanitizeInput(templateData?.userName || "User"),
            sanitizeInput(templateData.title),
            sanitizeInput(templateData.message),
            templateData.ctaText ? sanitizeInput(templateData.ctaText) : undefined,
            templateData.ctaUrl ? sanitizeInput(templateData.ctaUrl) : undefined
          );
          break;

        default:
          return NextResponse.json(
            { success: false, message: `Unknown template: ${cleanTemplate}` },
            { status: 400 }
          );
      }
    } else {
      // Raw email - require subject and message
      if (!cleanSubject || !cleanMessage) {
        return NextResponse.json(
          { success: false, message: "Subject and message are required for raw emails" },
          { status: 400 }
        );
      }
      emailContent = {
        subject: cleanSubject,
        html: cleanMessage,
      };
    }

    // Send the email
    const result = await sendEmail({
      to: cleanTo,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process email request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
