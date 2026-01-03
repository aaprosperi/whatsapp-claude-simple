# 🤖 WhatsApp + Claude Simple

Integración ultra simple de WhatsApp Business API con Claude AI.

## 🎯 ¿Qué hace?

1. Recibe mensajes de WhatsApp
2. Los envía a Claude
3. Responde en WhatsApp

**Eso es TODO.** Sin bases de datos, sin memoria, sin complicaciones. Perfecto para entender cómo funciona.

---

## 🚀 Guía Paso a Paso

### PASO 1: Configurar WhatsApp Business API

1. **Ir a Meta for Developers**: https://developers.facebook.com
2. **Crear una App**:
   - Click en "Crear app"
   - Selecciona tipo "Business" 
   - Dale un nombre: `"Claude WhatsApp Bot"`
3. **Agregar WhatsApp**:
   - En el dashboard, busca "WhatsApp" y click "Set Up"
   - Te darán un número de prueba de WhatsApp
4. **Copiar las credenciales**:
   - `WHATSAPP_TOKEN` (Token temporal, empieza con EAA...)
   - `PHONE_NUMBER_ID` (Número largo)
5. **Agregar tu número personal**:
   - En "To", agrega tu WhatsApp personal
   - Verifica el código que te llegue

### PASO 2: Obtener API Key de Claude

1. Ve a: https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copia la key (empieza con `sk-ant-...`)

### PASO 3: Deploy a Vercel

**Opción A: Deploy con un click** (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaprosperi/whatsapp-claude-simple)

**Opción B: Deploy manual**

```bash
# Clona el repo
git clone https://github.com/aaprosperi/whatsapp-claude-simple.git
cd whatsapp-claude-simple

# Deploy a Vercel
vercel
```

### PASO 4: Configurar Variables de Entorno

En Vercel Dashboard > Tu Proyecto > Settings > Environment Variables:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
WHATSAPP_TOKEN=EAAxxxxx
PHONE_NUMBER_ID=123456789
WEBHOOK_VERIFY_TOKEN=pixan_webhook_2025
```

**Importante**: Después de agregar las variables, redeploya el proyecto.

### PASO 5: Configurar el Webhook en Meta

1. **Copia tu URL de Vercel**: `https://tu-proyecto.vercel.app`
2. **En Meta for Developers**:
   - Ve a tu App > WhatsApp > Configuration
   - En "Webhook" click "Edit"
3. **Configurar**:
   - **Callback URL**: `https://tu-proyecto.vercel.app/api/webhook`
   - **Verify Token**: `pixan_webhook_2025` (el mismo que pusiste en Vercel)
   - Click "Verify and Save"
4. **Suscribirse a mensajes**:
   - Más abajo, en "Webhook fields"
   - Click "Manage" y activa `messages`

### PASO 6: ¡Probar!

1. Abre WhatsApp
2. Envía un mensaje al número de prueba que te dio Meta
3. **¡Claude te responderá!** 🎉

---

## 📂 Estructura del Proyecto

```
whatsapp-claude-simple/
├── api/
│   └── webhook.js          # TODO el código está aquí (100 líneas)
├── package.json            # Dependencias
├── vercel.json            # Config de Vercel
└── .env.example           # Template de variables
```

---

## 🔍 Cómo Funciona (Simple)

```javascript
// 1. WhatsApp envía un mensaje → api/webhook.js

// 2. Extraemos el texto del mensaje
const messageText = message.text.body;

// 3. Lo enviamos a Claude
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  messages: [{ role: 'user', content: messageText }]
});

// 4. Respondemos en WhatsApp
await fetch(`https://graph.facebook.com/.../messages`, {
  body: JSON.stringify({
    to: from,
    text: { body: response.content[0].text }
  })
});
```

---

## 🔧 Troubleshooting

### No recibo respuestas de Claude

**Solución**:
1. Ve a Vercel Dashboard > Tu Proyecto > Logs
2. Busca errores rojos
3. Verifica que todas las variables estén configuradas

### Error: "Webhook verification failed"

**Solución**:
- El `WEBHOOK_VERIFY_TOKEN` en Vercel debe ser exactamente igual al que pusiste en Meta
- Ambos son case-sensitive

### Error 401 en WhatsApp

**Solución**:
- Tu `WHATSAPP_TOKEN` expiró
- Ve a Meta > WhatsApp > API Setup > Generate new token
- Actualiza la variable en Vercel

### Claude no responde pero WhatsApp sí recibe

**Solución**:
- Verifica tu `ANTHROPIC_API_KEY`
- Revisa que tengas créditos en tu cuenta de Anthropic

---

## 💰 Costos

- **WhatsApp**: 1,000 conversaciones GRATIS/mes
- **Claude API**: ~$0.003 por mensaje (súper barato)
- **Vercel**: GRATIS para este proyecto
- **Total**: Prácticamente GRATIS para empezar

---

## 🎓 Lo que Aprendiste

✅ Cómo configurar WhatsApp Business Cloud API  
✅ Cómo crear webhooks  
✅ Cómo usar la API de Claude  
✅ Cómo hacer deploy serverless a Vercel  
✅ Las bases para construir un chatbot de IA  

---

## 🚀 Próximos Pasos

Ahora que tienes lo básico funcionando, puedes:

1. **Agregar memoria** - Que Claude recuerde la conversación
2. **Usar AI Gateway** - Rotar entre Claude/GPT/Gemini
3. **Agregar análisis de imágenes** - Claude puede ver fotos
4. **Rate limiting** - Limitar mensajes por usuario
5. **Templates de WhatsApp** - Mensajes con botones

---

## 📞 Soporte

¿Problemas? Abre un issue en GitHub o contáctame.

---

**Hecho con ❤️ para aprender y construir rápido**
