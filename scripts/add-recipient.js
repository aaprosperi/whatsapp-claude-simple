// Script para agregar tu número a la lista de destinatarios permitidos
// Ejecuta: node scripts/add-recipient.js

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WABA_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const PHONE_TO_ADD = '+5256300130435'; // Tu número

async function addRecipient() {
  console.log('📱 Agregando número a la lista de destinatarios permitidos...');
  console.log('Número:', PHONE_TO_ADD);
  console.log('WABA ID:', WABA_ID);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WABA_ID}/phone_numbers`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cc: '52',
          phone_number: '5630010435',
          migrate_phone_number: false
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error:', data.error);
      console.log('\n📋 Respuesta completa:', JSON.stringify(data, null, 2));
    } else {
      console.log('✅ Número agregado exitosamente!');
      console.log('📋 Respuesta:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error al hacer la petición:', error.message);
  }
}

addRecipient();
