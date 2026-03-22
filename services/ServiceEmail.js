const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────────────────────
// 🎨 II SKIN BRAND COLORS
//   #24CEA6  Teal   — primary accent
//   #E73538  Red    — secondary / logo highlight
//   #1D1D1B  Black  — base dark
//   #EBE43C  Yellow
//   #FFFFFF  White
// ─────────────────────────────────────────────────────────────

// ─── Shared header & footer HTML snippets ────────────────────
const emailHeader = `
  <div style="background-color:#1D1D1B;padding:28px 40px;text-align:center;position:relative;">
    <!-- top gradient stripe -->
    <div style="height:4px;background:linear-gradient(90deg,#E73538 40%,#24CEA6 100%);position:absolute;top:0;left:0;right:0;border-radius:8px 8px 0 0;"></div>
    <!-- Isotipo text logo -->
    <div style="font-family:'Courier New',monospace;font-size:32px;font-weight:900;letter-spacing:4px;color:#FFFFFF;line-height:1;">
      II <span style="color:#24CEA6;">SKIN</span>
    </div>
    <div style="font-size:9px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-top:4px;">
      Tu Segunda Piel
    </div>
  </div>
`;

const emailFooter = `
  <div style="background:#1D1D1B;padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
    <!-- color dots -->
    <div style="display:flex;justify-content:center;gap:6px;margin-bottom:16px;">
      <div style="width:10px;height:10px;border-radius:50%;background:#24CEA6;display:inline-block;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#E73538;display:inline-block;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#EBE43C;display:inline-block;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#F731B5;display:inline-block;"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#4F8DCB;display:inline-block;"></div>
    </div>
    <p style="font-family:'Courier New',monospace;color:#24CEA6;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px;">
      www.iiskin.com
    </p>
    <p style="font-size:11px;color:rgba(255,255,255,0.3);margin:0;">
      © 2025 II SKIN SAS. Todos los derechos reservados.<br/>
      ¿Necesitas ayuda? 
      <a href="mailto:edithmayerliastudillorojas@gmail.com" style="color:#24CEA6;text-decoration:none;">
        edithmayerliastudillorojas@gmail.com
      </a>
    </p>
  </div>
`;

// ─────────────────────────────────────────────────────────────
// 1️⃣  RECUPERACIÓN DE CONTRASEÑA
// ─────────────────────────────────────────────────────────────
const sendPasswordResetEmail = async (to, token, expiresAt) => {
  const resetUrl = `http://localhost:3000/cambio?token=${token}`;

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f0ee;padding:40px 20px;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        ${emailHeader}

        <!-- Body -->
        <div style="background:#FFFFFF;padding:44px 40px;text-align:center;">
          <!-- Lock icon -->
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(36,206,166,0.1);border:2px solid rgba(36,206,166,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:28px;">
            🔐
          </div>

          <h2 style="font-family:'Courier New',monospace;font-size:22px;font-weight:900;color:#1D1D1B;letter-spacing:2px;margin:0 0 12px;">
            RECUPERA TU ACCESO
          </h2>
          <div style="width:40px;height:3px;background:linear-gradient(90deg,#E73538,#24CEA6);margin:0 auto 20px;border-radius:2px;"></div>

          <p style="color:#626161;font-size:14px;line-height:1.8;margin:0 0 28px;">
            Recibimos una solicitud para restablecer tu contraseña en la plataforma 
            <strong style="color:#1D1D1B;">II SKIN SAS</strong>. 
            Haz clic en el botón para continuar.
          </p>

          <!-- CTA Button -->
          <a href="${resetUrl}" style="
            display:inline-block;
            padding:14px 36px;
            background:linear-gradient(135deg,#24CEA6,#1ab889);
            color:#1D1D1B;
            text-decoration:none;
            border-radius:3px;
            font-size:12px;
            font-weight:800;
            letter-spacing:3px;
            text-transform:uppercase;
            font-family:'Courier New',monospace;
          ">
            Restablecer Contraseña →
          </a>

          <!-- URL fallback -->
          <div style="margin-top:28px;padding:14px 18px;background:#f5f5f3;border-radius:4px;border-left:3px solid #24CEA6;">
            <p style="font-size:11px;color:#626161;margin:0 0 4px;">Si el botón no funciona, copia este enlace:</p>
            <a href="${resetUrl}" style="font-size:11px;color:#24CEA6;word-break:break-all;">${resetUrl}</a>
          </div>

          <!-- Warning box -->
          <div style="margin-top:24px;padding:14px 18px;background:rgba(231,53,56,0.05);border-radius:4px;border:1px solid rgba(231,53,56,0.2);">
            <p style="font-size:12px;color:#E73538;margin:0;font-weight:600;">
              ⚠ Este enlace expira en <strong>1 hora</strong>.<br/>
              Si no solicitaste este cambio, ignora este mensaje.
            </p>
          </div>
        </div>

        ${emailFooter}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"II SKIN SAS" <construserviciosmdcolombia@gmail.com>',
    to,
    subject: "🔐 Recuperación de contraseña — II SKIN SAS",
    html,
  });
};


// ─────────────────────────────────────────────────────────────
// 2️⃣  NOTIFICACIÓN DE NUEVO CONTACTO (para el admin)
// ─────────────────────────────────────────────────────────────
const sendContactNotification = async (contactData) => {
  const { email, name, message, company, phone, projectType } = contactData;

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f0ee;padding:40px 20px;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        ${emailHeader}

        <!-- Body -->
        <div style="background:#FFFFFF;padding:44px 40px;">
          <!-- Badge -->
          <div style="display:inline-block;background:rgba(36,206,166,0.1);border:1px solid rgba(36,206,166,0.3);border-radius:2px;padding:5px 14px;margin-bottom:20px;">
            <span style="font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:#24CEA6;">
              ✉ Nuevo Mensaje de Contacto
            </span>
          </div>

          <h2 style="font-family:'Courier New',monospace;font-size:20px;font-weight:900;color:#1D1D1B;margin:0 0 8px;">
            ${name}
          </h2>
          <div style="width:36px;height:3px;background:linear-gradient(90deg,#E73538,#24CEA6);margin:0 0 24px;border-radius:2px;"></div>

          <!-- Contact data table -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 14px;background:#f5f5f3;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#626161;font-weight:700;width:120px;border-bottom:1px solid #ebebea;">Correo</td>
              <td style="padding:10px 14px;background:#f5f5f3;font-size:13px;color:#1D1D1B;border-bottom:1px solid #ebebea;">
                <a href="mailto:${email}" style="color:#24CEA6;text-decoration:none;">${email}</a>
              </td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding:10px 14px;background:#fafaf8;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#626161;font-weight:700;border-bottom:1px solid #ebebea;">Empresa</td>
              <td style="padding:10px 14px;background:#fafaf8;font-size:13px;color:#1D1D1B;border-bottom:1px solid #ebebea;">${company}</td>
            </tr>` : ''}
            ${phone ? `
            <tr>
              <td style="padding:10px 14px;background:#f5f5f3;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#626161;font-weight:700;border-bottom:1px solid #ebebea;">Teléfono</td>
              <td style="padding:10px 14px;background:#f5f5f3;font-size:13px;color:#1D1D1B;border-bottom:1px solid #ebebea;">${phone}</td>
            </tr>` : ''}
            ${projectType ? `
            <tr>
              <td style="padding:10px 14px;background:#fafaf8;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#626161;font-weight:700;border-bottom:1px solid #ebebea;">Tipo</td>
              <td style="padding:10px 14px;background:#fafaf8;font-size:13px;color:#1D1D1B;border-bottom:1px solid #ebebea;">${projectType}</td>
            </tr>` : ''}
          </table>

          <!-- Message block -->
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#626161;font-weight:700;margin:0 0 8px;">Mensaje</p>
          <div style="background:#1D1D1B;border-radius:4px;padding:20px 22px;position:relative;overflow:hidden;">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#24CEA6,#E73538);"></div>
            <p style="font-size:14px;color:rgba(255,255,255,0.75);line-height:1.8;margin:0;">${message}</p>
          </div>

          <!-- Reply hint -->
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${email}" style="
              display:inline-block;padding:12px 28px;
              background:#E73538;color:#FFFFFF;text-decoration:none;
              border-radius:3px;font-size:11px;font-weight:800;letter-spacing:3px;
              text-transform:uppercase;font-family:'Courier New',monospace;
            ">Responder desde Gmail →</a>
          </div>
        </div>

        ${emailFooter}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"II SKIN Contacto" <construserviciosmdcolombia@gmail.com>',
      to: `${email}, construserviciosmdcolombia@gmail.com`,
      subject: `✉ Nuevo contacto de ${name} — II SKIN SAS`,
      html,
    });
  } catch (error) {
    console.error('Error enviando correo de contacto:', error);
    throw error;
  }
};


// ─────────────────────────────────────────────────────────────
// 3️⃣  RESPUESTA A CONTACTO  🆕 (respuesta desde el dashboard)
// ─────────────────────────────────────────────────────────────
const sendReplyToContact = async (contactData, replyMessage) => {
  const { email, name } = contactData;

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f0ee;padding:40px 20px;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        ${emailHeader}

        <!-- Body -->
        <div style="background:#FFFFFF;padding:44px 40px;">
          <!-- Greeting -->
          <div style="display:inline-block;background:rgba(36,206,166,0.1);border:1px solid rgba(36,206,166,0.3);border-radius:2px;padding:5px 14px;margin-bottom:20px;">
            <span style="font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:#24CEA6;">
              💬 Respuesta a tu mensaje
            </span>
          </div>

          <h2 style="font-family:'Courier New',monospace;font-size:22px;font-weight:900;color:#1D1D1B;letter-spacing:2px;margin:0 0 8px;">
            HOLA, ${name.toUpperCase()}
          </h2>
          <div style="width:40px;height:3px;background:linear-gradient(90deg,#E73538,#24CEA6);margin:0 0 20px;border-radius:2px;"></div>

          <p style="color:#626161;font-size:14px;line-height:1.8;margin:0 0 28px;">
            Gracias por contactarte con <strong style="color:#1D1D1B;">II SKIN SAS</strong>. 
            Hemos revisado tu mensaje y te compartimos nuestra respuesta:
          </p>

          <!-- Reply block -->
          <div style="background:#1D1D1B;border-radius:4px;padding:24px 24px;position:relative;overflow:hidden;margin-bottom:28px;">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#24CEA6,#E73538);"></div>
            <p style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#24CEA6;font-weight:700;margin:0 0 10px;">
              Respuesta del equipo II SKIN
            </p>
            <p style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.9;margin:0;">${replyMessage}</p>
          </div>

          <!-- Divider -->
          <div style="height:1px;background:#ebebea;margin:0 0 24px;"></div>

          <!-- CTA - visit store -->
          <div style="text-align:center;margin-bottom:28px;">
            <p style="color:#626161;font-size:13px;margin:0 0 16px;">
              ¿Querés ver nuestra colección mientras tanto?
            </p>
            <a href="https://www.iiskin.com" style="
              display:inline-block;padding:13px 32px;
              background:linear-gradient(135deg,#24CEA6,#1ab889);
              color:#1D1D1B;text-decoration:none;
              border-radius:3px;font-size:11px;font-weight:800;
              letter-spacing:3px;text-transform:uppercase;
              font-family:'Courier New',monospace;
            ">Ver Tienda II SKIN →</a>
          </div>

          <!-- Contact again hint -->
          <div style="padding:14px 18px;background:#f5f5f3;border-radius:4px;border-left:3px solid #E73538;">
            <p style="font-size:12px;color:#626161;margin:0;line-height:1.7;">
              ¿Tienes más preguntas? Puedes responder directamente a este correo o escribirnos a
              <a href="mailto:edithmayerliastudillorojas@gmail.com" style="color:#24CEA6;text-decoration:none;">
                edithmayerliastudillorojas@gmail.com
              </a>
            </p>
          </div>
        </div>

        ${emailFooter}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"II SKIN SAS" <construserviciosmdcolombia@gmail.com>',
      to: email,
      subject: `💬 Respuesta de II SKIN SAS — Hola ${name}`,
      html,
    });
  } catch (error) {
    console.error('Error enviando respuesta a contacto:', error);
    throw error;
  }
};


// ─────────────────────────────────────────────────────────────
// 4️⃣  BIENVENIDA
// ─────────────────────────────────────────────────────────────
const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f0ee;padding:40px 20px;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        ${emailHeader}

        <!-- Hero dark band -->
        <div style="background:#1D1D1B;padding:40px;text-align:center;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;opacity:0.05;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22 viewBox=%220 0 72 72%22%3E%3Cline x1=%2236%22 y1=%226%22 x2=%2236%22 y2=%2238%22 stroke=%2224CEA6%22 stroke-width=%225%22 stroke-linecap=%22round%22/%3E%3Cline x1=%2236%22 y1=%2238%22 x2=%2210%22 y2=%2262%22 stroke=%2224CEA6%22 stroke-width=%225%22 stroke-linecap=%22round%22/%3E%3Cline x1=%2236%22 y1=%2238%22 x2=%2262%22 y2=%2262%22 stroke=%2224CEA6%22 stroke-width=%225%22 stroke-linecap=%22round%22/%3E%3C/svg%3E');background-size:72px 72px;"></div>
          <p style="font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#24CEA6;margin:0 0 10px;font-weight:700;">
            Bienvenido/a a la familia
          </p>
          <h2 style="font-family:'Courier New',monospace;font-size:28px;font-weight:900;color:#FFFFFF;margin:0;letter-spacing:2px;">
            ${name.toUpperCase()}
          </h2>
          <div style="width:40px;height:3px;background:linear-gradient(90deg,#E73538,#24CEA6);margin:12px auto 0;border-radius:2px;"></div>
        </div>

        <!-- Body -->
        <div style="background:#FFFFFF;padding:44px 40px;text-align:center;">
          <p style="color:#626161;font-size:15px;line-height:1.8;margin:0 0 28px;">
            Tu cuenta en <strong style="color:#1D1D1B;">II SKIN SAS</strong> fue creada exitosamente.
            Ahora eres parte de la comunidad que vive al máximo.
          </p>

          <!-- Info cards row -->
          <div style="display:flex;gap:12px;margin-bottom:32px;text-align:left;">
            <div style="flex:1;padding:16px;background:#f5f5f3;border-radius:4px;border-top:3px solid #24CEA6;">
              <div style="font-size:20px;margin-bottom:6px;">📦</div>
              <div style="font-size:12px;font-weight:700;color:#1D1D1B;margin-bottom:3px;">Mayor y Detal</div>
              <div style="font-size:11px;color:#626161;">Accede a precios especiales</div>
            </div>
            <div style="flex:1;padding:16px;background:#f5f5f3;border-radius:4px;border-top:3px solid #E73538;">
              <div style="font-size:20px;margin-bottom:6px;">🎽</div>
              <div style="font-size:12px;font-weight:700;color:#1D1D1B;margin-bottom:3px;">Colección 2025</div>
              <div style="font-size:11px;color:#626161;">Nuevas prendas disponibles</div>
            </div>
            <div style="flex:1;padding:16px;background:#f5f5f3;border-radius:4px;border-top:3px solid #EBE43C;">
              <div style="font-size:20px;margin-bottom:6px;">🚀</div>
              <div style="font-size:12px;font-weight:700;color:#1D1D1B;margin-bottom:3px;">Envíos Colombia</div>
              <div style="font-size:11px;color:#626161;">A todo el territorio</div>
            </div>
          </div>

          <a href="https://www.iiskin.com" style="
            display:inline-block;padding:14px 36px;
            background:linear-gradient(135deg,#24CEA6,#1ab889);
            color:#1D1D1B;text-decoration:none;border-radius:3px;
            font-size:12px;font-weight:800;letter-spacing:3px;
            text-transform:uppercase;font-family:'Courier New',monospace;
          ">Explorar Tienda →</a>

          <!-- Security note -->
          <div style="margin-top:28px;padding:14px 18px;background:rgba(231,53,56,0.05);border-radius:4px;border:1px solid rgba(231,53,56,0.15);">
            <p style="font-size:12px;color:#626161;margin:0;line-height:1.7;">
              <strong style="color:#E73538;">Aviso de seguridad:</strong> Si no fuiste tú quien creó esta cuenta, 
              contáctanos de inmediato a 
              <a href="mailto:edithmayerliastudillorojas@gmail.com" style="color:#24CEA6;text-decoration:none;">edithmayerliastudillorojas@gmail.com</a>
            </p>
          </div>

          <p style="font-size:11px;color:rgba(0,0,0,0.25);margin-top:16px;">
            Registrado el ${new Date().toLocaleString('es-CO')} · ${to}
          </p>
        </div>

        ${emailFooter}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"II SKIN SAS" <construserviciosmdcolombia@gmail.com>',
    to,
    subject: `🎽 ¡Bienvenido/a a II SKIN SAS, ${name}!`,
    html,
  });
};


// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────
module.exports = {
  sendPasswordResetEmail,
  sendContactNotification,
  sendReplyToContact,   // 🆕
  sendWelcomeEmail,
};
