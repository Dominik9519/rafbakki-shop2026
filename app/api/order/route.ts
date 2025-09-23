import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  unitPrice: z.number().nonnegative(),
  qty: z.number().int().min(1),
});

const orderSchema = z.object({
  // NOWOŚĆ: lista pozycji (zamiast jednego produktu)
  items: z.array(itemSchema).min(1),

  // Dane klienta
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Wsteczna kompatybilność: jeśli przyjdzie stary format, zamienimy go na items[]
function coerceToNewPayload(body: any) {
  if (Array.isArray(body?.items) && body.items.length) return body;

  if (body?.productId && body?.productName) {
    const unitPrice = Number(body.unitPrice || 0);
    const qty = Number(body.qty || 1);
    return {
      items: [
        {
          id: String(body.productId),
          name: String(body.productName),
          unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
          qty: Number.isFinite(qty) ? qty : 1,
        },
      ],
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      notes: body.notes,
    };
  }
  return body;
}

function formatISK(n: number) {
  try {
    return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "ISK", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${Math.round(n)} ISK`;
  }
}

function makeOrderNo() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RAF-${y}${m}${day}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const coerced = coerceToNewPayload(raw);
    const data = orderSchema.parse(coerced);

    const orderNo = makeOrderNo();
    const subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // HTML z tabelą
    const rowsHtml = data.items
      .map(
        (i) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #2c2c2c;">${i.name}<br/><span style="color:#9aa0a6;font-size:12px">ID: ${i.id}</span></td>
          <td style="padding:8px 10px;text-align:center;border-bottom:1px solid #2c2c2c;">${i.qty}</td>
          <td style="padding:8px 10px;text-align:right;border-bottom:1px solid #2c2c2c;">${formatISK(i.unitPrice)}</td>
          <td style="padding:8px 10px;text-align:right;border-bottom:1px solid #2c2c2c;"><b>${formatISK(i.unitPrice * i.qty)}</b></td>
        </tr>`
      )
      .join("");

    const orderHtml = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;color:#e8eaed;background:#0b0f17;padding:24px">
        <div style="max-width:720px;margin:0 auto;background:#141a24;border:1px solid #232a36;border-radius:14px;padding:24px">
          <h1 style="margin:0 0 8px 0;font-size:28px;">Nowe zamówienie</h1>
          <p style="margin:0 0 16px 0;color:#9aa0a6">Numer zamówienia: <b>${orderNo}</b></p>

          <table style="width:100%;border-collapse:collapse;background:#0f141d;border-radius:10px;overflow:hidden">
            <thead>
              <tr style="background:#0d1320;color:#cfd6e4">
                <th style="text-align:left;padding:10px">Produkt</th>
                <th style="text-align:center;padding:10px;width:70px">Ilość</th>
                <th style="text-align:right;padding:10px;width:120px">Cena jedn.</th>
                <th style="text-align:right;padding:10px;width:120px">Razem</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>

          <div style="text-align:right;margin-top:12px;font-size:16px">
            <span>Suma:</span> <b>${formatISK(subtotal)}</b>
          </div>

          <hr style="border:none;border-top:1px solid #232a36;margin:20px 0" />

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div>
              <div style="color:#9aa0a6;font-size:12px">Klient</div>
              <div><b>${data.name}</b></div>
              <div style="color:#9aa0a6">${data.email || "-"}</div>
              ${data.phone ? `<div style="color:#9aa0a6">${data.phone}</div>` : ""}
            </div>
            <div>
              <div style="color:#9aa0a6;font-size:12px">Adres</div>
              <div>${data.address || "-"}</div>
            </div>
          </div>

          ${
            data.notes
              ? `<div style="margin-top:16px">
                  <div style="color:#9aa0a6;font-size:12px">Uwagi</div>
                  <div>${data.notes}</div>
                </div>`
              : ""
          }
        </div>
      </div>
    `;

    // 1) Mail do sklepu
    await transporter.sendMail({
      from: `"Rafbakki Shop" <${process.env.SMTP_USER}>`,
      to: process.env.ORDERS_TO,
      subject: `Zamówienie ${orderNo} – ${data.name}`,
      html: orderHtml,
      text: [
        `Nowe zamówienie ${orderNo}`,
        ...data.items.map((i) => `- ${i.name} (${i.id}) ×${i.qty} @ ${i.unitPrice} = ${i.unitPrice * i.qty}`),
        `Suma: ${subtotal}`,
        "",
        `Klient: ${data.name}`,
        `Email: ${data.email}`,
        `Telefon: ${data.phone || "-"}`,
        `Adres: ${data.address || "-"}`,
        data.notes ? `Uwagi: ${data.notes}` : "",
      ].join("\n"),
    });

    // 2) Auto-reply do klienta (dane do przelewu)
    const bank = process.env.BANK_ACCOUNT;
    const kt = process.env.KENNITALA;
    const itemsTxt = data.items.map((i) => `• ${i.name} ×${i.qty} @ ${formatISK(i.unitPrice)}`).join("\n");
    const replyText =
`Takk fyrir zamówienie w Rafbakki 🧰

Numer zamówienia: ${orderNo}

Pozycje:
${itemsTxt}

Suma: ${formatISK(subtotal)}

Prosimy o przelew:
Rachunek: ${bank}
Kennitala: ${kt}
Tytuł: ${orderNo} – ${data.name}

Po zaksięgowaniu wyślemy potwierdzenie i termin dostawy.
W razie pytań: ${process.env.ORDERS_TO}

Kveðja,
Rafbakki slf.`;

    await transporter.sendMail({
      from: `"Rafbakki Shop" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Zamówienie ${orderNo} – dane do przelewu`,
      text: replyText,
    });

    return NextResponse.json({ ok: true, orderId: orderNo });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
