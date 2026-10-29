function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\r\n|\r|\n/g, "<br>\n");
}

function missing(value) {
  return value == null || value === "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  let body;
  try {
    body = req.body;
  } catch (error) {
    console.error(error);
    res.status(400).end();
    return;
  }

  if (!body || typeof body !== "object") {
    res.status(400).end();
    return;
  }

  const { name, agent, email, number, address, info } = body;

  if (missing(name) || missing(email) || missing(number) || missing(address)) {
    res.status(400).end();
    return;
  }

  const html = [
    `name: ${escapeHtml(name)}`,
    `agent: ${escapeHtml(agent)}`,
    `email: ${escapeHtml(email)}`,
    `number: ${escapeHtml(number)}`,
    `address: ${escapeHtml(address)}`,
    `info: ${escapeHtml(info)}`,
  ].join("<br>\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Connor & Company <bookings@e.connorandcompany.co.uk>",
        to: process.env.EPC_TO_EMAIL,
        reply_to: email,
        subject: `New EPC booking: ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
      res.status(500).json({ ok: false });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
