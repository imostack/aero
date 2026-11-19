"use server";

import { redirect } from "next/navigation";
import { sendAdminAccepted, sendFinderAccepted } from "@/lib/email";
import { acceptQuote, getRequestByToken } from "@/lib/rfq";

export async function acceptFinderQuote(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const quoteId = Number(formData.get("quoteId"));
  const request = await getRequestByToken(token);
  if (!request || !Number.isInteger(quoteId)) redirect("/");

  const accepted = await acceptQuote(request.id, quoteId);
  if (accepted) {
    await Promise.all([sendAdminAccepted(request, accepted), sendFinderAccepted(request)]);
  }
  redirect(`/quote/${token}`);
}
