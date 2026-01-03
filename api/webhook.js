// WhatsApp + Claude - Ultra Simple Integration
// Este archivo recibe mensajes de WhatsApp y responde usando Claude

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Configuración de WhatsApp
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

  // PASO 1: Verificación del webhook (Meta lo requiere una sola vez)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // PASO 2: Recibir mensajes de WhatsApp
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Verificar que sea un mensaje
      if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from; // Número del usuario
        const messageText = message.text?.body; // Texto del mensaje

        if (!messageText) {
          return res.status(200).send('OK');
        }

        console.log(`📱 Mensaje recibido de ${from}: ${messageText}`);

        // PASO 3: Enviar a Claude
        console.log('🤖 Consultando a Claude...');
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: messageText
            }
          ],
        });

        const responseText = claudeResponse.content[0].text;
        console.log(`💬 Claude respondió: ${responseText}`);

        // PASO 4: Enviar respuesta a WhatsApp
        const whatsappResponse = await fetch(
          `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: from,
              text: { body: responseText },
            }),
          }
        );

        const whatsappData = await whatsappResponse.json();
        console.log('✅ Mensaje enviado a WhatsApp:', whatsappData);

        return res.status(200).json({ success: true });
      }

      return res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).send('Method Not Allowed');
}
