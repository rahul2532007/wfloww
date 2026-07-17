import { t as Resend } from "../_libs/resend+standardwebhooks.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-server-Cb1XHhwj.js
function escapeHtml(value) {
	return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function page(title, body) {
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#efeae0;color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;padding:32px 16px"><main style="max-width:520px;margin:0 auto;background:#f7f4ec;border:1px solid #e0dbd1;padding:40px 36px"><p style="margin:0 0 32px;font:500 22px Georgia,serif">Qfloww<span style="color:#c99a3d">.</span></p>${body}</main></body></html>`;
}
function bookingConfirmation(data) {
	const businessName = String(data.business_name ?? "your appointment");
	const clientName = data.client_name ? `Hi ${escapeHtml(data.client_name)},` : "Hi,";
	const token = escapeHtml(data.token_number ?? "-");
	const slot = data.slot_name ? `<p><strong>Slot:</strong> ${escapeHtml(data.slot_name)}${data.slot_time ? ` · ${escapeHtml(data.slot_time)}` : ""}</p>` : "";
	const service = data.service_name ? `<p><strong>Service:</strong> ${escapeHtml(data.service_name)}</p>` : "";
	const date = data.date ? `<p><strong>Date:</strong> ${escapeHtml(data.date)}</p>` : "";
	return {
		subject: `Your token #${String(data.token_number ?? "-")} at ${businessName}`,
		html: page("Booking confirmed", `<p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5a544e">Booking confirmed</p><h1 style="font:500 34px Georgia,serif">${escapeHtml(businessName)}</h1><p style="line-height:1.65;color:#5a544e">${clientName} your booking is confirmed. Please arrive on time and show this token at the counter.</p><section style="border:1px solid #e0dbd1;border-top:2px solid #0a0a0a;border-bottom:2px solid #0a0a0a;padding:28px 24px;text-align:center"><p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5a544e">Your token</p><p style="margin:0;font:500 72px Georgia,serif">${token}</p></section><section style="margin-top:24px;color:#5a544e">${date}${slot}${service}</section><hr style="border:0;border-top:1px solid #e0dbd1;margin:32px 0"><p style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a827a">Can't make it? Contact ${escapeHtml(businessName)} to reschedule or cancel.</p>`),
		text: `${clientName} Your booking at ${businessName} is confirmed. Token: ${token}. ${data.date ? `Date: ${data.date}. ` : ""}${data.slot_name ? `Slot: ${data.slot_name}${data.slot_time ? ` · ${data.slot_time}` : ""}. ` : ""}${data.service_name ? `Service: ${data.service_name}.` : ""}`
	};
}
function doctorInvite(data) {
	const businessName = String(data.businessName ?? "a clinic");
	const recipient = data.recipient ? ` at ${escapeHtml(data.recipient)}` : "";
	const acceptUrl = escapeHtml(data.acceptUrl ?? "");
	return {
		subject: `You've been invited to ${businessName} on Qfloww`,
		html: page("Doctor invitation", `<p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5a544e">Doctor invitation</p><h1 style="font:500 34px Georgia,serif">You've been invited.</h1><p style="line-height:1.65;color:#5a544e"><strong>${escapeHtml(businessName)}</strong> has invited you${recipient} to join their clinic on Qfloww as a doctor.</p><p><a href="${acceptUrl}" style="display:inline-block;background:#0a0a0a;color:#f7f4ec;padding:12px 24px;border-radius:999px;text-decoration:none">Accept invitation</a></p><p style="line-height:1.65;color:#5a544e">Or paste this link into your browser:<br><a href="${acceptUrl}">${acceptUrl}</a></p><hr style="border:0;border-top:1px solid #e0dbd1;margin:32px 0"><p style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a827a">Didn't expect this? You can safely ignore this email — the invite expires in 14 days.</p>`),
		text: `You've been invited to ${businessName} on Qfloww as a doctor. Accept the invitation: ${String(data.acceptUrl ?? "")}`
	};
}
async function sendTransactionalEmailServer(opts) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM_EMAIL;
	if (!apiKey || !from) {
		console.error("Transactional email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is unset");
		return {
			success: false,
			reason: "email_not_configured"
		};
	}
	try {
		const rendered = opts.templateName === "booking-confirmation" ? bookingConfirmation(opts.templateData ?? {}) : doctorInvite(opts.templateData ?? {});
		const { error } = await new Resend(apiKey).emails.send({
			from,
			to: [opts.recipientEmail],
			subject: rendered.subject,
			html: rendered.html,
			text: rendered.text,
			headers: opts.idempotencyKey ? { "Idempotency-Key": opts.idempotencyKey } : {}
		});
		if (error) {
			console.error("Transactional email failed", {
				templateName: opts.templateName,
				error
			});
			return {
				success: false,
				reason: "provider_error"
			};
		}
		return { success: true };
	} catch (error) {
		console.error("Transactional email failed", {
			templateName: opts.templateName,
			error
		});
		return {
			success: false,
			reason: "provider_error"
		};
	}
}
//#endregion
export { sendTransactionalEmailServer };
