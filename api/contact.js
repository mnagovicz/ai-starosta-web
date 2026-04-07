const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, obec, email, telefon } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Chybí jméno nebo e-mail" });
  }

  const params = {
    Source: "noreply@isprodukce.cz",
    Destination: {
      ToAddresses: ["martin@isprodukce.cz"],
    },
    Message: {
      Subject: {
        Data: `AI Starosta — nová poptávka: ${name} (${obec || "obec neuvedena"})`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <h2>Nová poptávka z webu AI Starosta</h2>
            <table style="font-family: Arial, sans-serif; font-size: 15px; border-collapse: collapse;">
              <tr><td style="padding: 6px 16px 6px 0; font-weight: bold;">Jméno:</td><td>${name}</td></tr>
              <tr><td style="padding: 6px 16px 6px 0; font-weight: bold;">Obec:</td><td>${obec || "—"}</td></tr>
              <tr><td style="padding: 6px 16px 6px 0; font-weight: bold;">E-mail:</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 6px 16px 6px 0; font-weight: bold;">Telefon:</td><td>${telefon || "—"}</td></tr>
            </table>
            <p style="margin-top: 24px; color: #888; font-size: 13px;">Odesláno z ai-starosta.vercel.app</p>
          `,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    await ses.send(new SendEmailCommand(params));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SES error:", err);
    return res.status(500).json({ error: "Chyba při odesílání" });
  }
};
