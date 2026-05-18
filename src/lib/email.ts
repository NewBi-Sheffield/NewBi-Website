import { Resend } from "resend";
import { applicationConfirmationHtml } from "./emails/applicationConfirmation";
import { applicationReceivedHtml } from "./emails/applicationReceived";
import { listingApprovedHtml } from "./emails/listingApproved";
import { studentConfirmationHtml } from "./emails/studentConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Newbi <hello@newbi.co.uk>";

export async function sendApplicationConfirmation({
  name,
  email,
  businessName,
  confirmationUrl,
}: {
  name: string;
  email: string;
  businessName: string;
  confirmationUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm your email to complete your Newbi application",
    html: applicationConfirmationHtml({ name, businessName, confirmationUrl }),
  });
}

export async function sendApplicationReceived({
  name,
  email,
  businessName,
}: {
  name: string;
  email: string;
  businessName: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `We've received your application — ${businessName}`,
    html: applicationReceivedHtml({ name, businessName }),
  });
}

export async function sendStudentConfirmation({
  name,
  email,
  confirmationUrl,
}: {
  name: string;
  email: string;
  confirmationUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm your Newbi account",
    html: studentConfirmationHtml({ name, confirmationUrl }),
  });
}

export async function sendListingApproved({
  name,
  email,
  businessName,
  listingUrl,
}: {
  name: string;
  email: string;
  businessName: string;
  listingUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your Newbi listing is live — ${businessName}`,
    html: listingApprovedHtml({ name, businessName, listingUrl }),
  });
}
