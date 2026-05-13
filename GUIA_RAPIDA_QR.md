# 🚀 Guía Rápida: QR Estático para Reparaciones

## Inicio Rápido (5 minutos)

### Paso 1: Acceder a una Reparación
1. Abre el panel de **Reparaciones**
2. Haz clic en cualquier reparación para ver sus detalles
3. Se abre el modal "Reparación [CÓDIGO]"

### Paso 2: Ver el QR
1. En el footer del modal, busca el botón azul: **"🔗 Ver Comprobante QR"**
2. Haz clic
3. Verás un modal nuevo con el código QR generado

### Paso 3: Usa el QR
Tienes 3 opciones:

| Botón | Acción | Resultado |
|-------|--------|-----------|
| **📄 Ver Comprobante** | Abre página completa | Se abre en pestaña nueva con todos los detalles |
| **📥 Descargar QR** | Descarga imagen PNG | Archivo `comprobante-{CODIGO}.png` en descargas |
| **Cerrar** | Cierra el modal | Vuelves a la reparación |

---

## 📋 Casos de Uso

### Caso 1: Imprimir Comprobante
```
1. Haz clic en "Ver Comprobante QR"
2. Clic en "📄 Ver Comprobante"
3. Se abre en nueva pestaña
4. Presiona Ctrl+P (o Cmd+P en Mac)
5. Selecciona impresora
6. ¡Impreso! 🖨️
```

### Caso 2: Compartir QR por WhatsApp
```
1. Haz clic en "Ver Comprobante QR"
2. Clic en "📥 Descargar QR"
3. Abre WhatsApp
4. Adjunta la imagen descargada
5. Cliente escanea y ve comprobante ✅
```

### Caso 3: Compartir enlace directo
```
URL del comprobante:
http://192.168.18.6:8000/repair-receipt/123

Comparte esta URL:
- Por email
- Por mensaje
- Por SMS
- En redes sociales

Cliente accede sin necesidad de escanear QR
```

### Caso 4: Adjuntar a documento
```
1. Descarga el QR
2. Inserta en Word/PDF
3. Incluye en reporte
4. Cliente escanea QR para ver detalles
```

---

## ✨ Ventajas

✅ **Único por reparación** - Siempre lleva a la misma información
✅ **Fijo** - No cambia con el tiempo
✅ **Fácil de imprimir** - Descarga y listo
✅ **Compartible** - Envía por email, WhatsApp, etc.
✅ **Escaneable** - Cualquier teléfono puede leer QR
✅ **Acceso público** - No requiere login para ver comprobante
✅ **Responsivo** - Se ve bien en cualquier dispositivo

---

## 🎨 Qué Muestra el Comprobante

```
┌─────────────────────────────────────┐
│  Comprobante de Reparación          │
│  Código: REP-001                    │
├─────────────────────────────────────┤
│  [QR]  Código QR Escaneable         │
├─────────────────────────────────────┤
│  ✓ Código y Estado                  │
│  ✓ Información del Cliente          │
│  ✓ Email, Teléfono, Documento      │
│  ✓ Dispositivo y Falla Reportada   │
│  ✓ Notas Técnicas (si existen)     │
│  ✓ Fotos de la Reparación          │
│  ✓ Costo Total (S/ x,xxx.xx)       │
│  ✓ Fecha de Registro y Técnico     │
├─────────────────────────────────────┤
│  [Botones: Imprimir | Descargar QR  │
└─────────────────────────────────────┘
```

---

## 🔗 URLs Importantes

```
Comprobante: http://192.168.18.6:8000/repair-receipt/123
Frontend:    http://192.168.18.6:3000
API Backend: http://192.168.18.6:8000/api
```

---

## ❓ Preguntas Frecuentes

### ¿El QR es único para cada reparación?
✅ **SÍ** - Cada reparación tiene su propio QR codificado con su URL única

### ¿El QR cambia con el tiempo?
❌ **NO** - El QR es estático. Siempre lleva a la misma URL

### ¿Necesito internet para escanear?
✅ **SÍ** - Se necesita conexión para acceder a la página del comprobante

### ¿Puede alguien acceder sin contraseña?
✅ **SÍ** - El comprobante es público (acceso sin autenticación)

### ¿Puedo imprimir el QR?
✅ **SÍ** - Descárgalo y luego imprime, o abre el comprobante e imprime directamente

### ¿Funciona en dispositivos móviles?
✅ **SÍ** - El diseño es responsivo y se ve bien en cualquier tamaño

### ¿Puedo cambiar los colores del QR?
✅ **SÍ** - Se puede personalizar en código (contacta al desarrollador)

---

## 🛠️ Requisitos Técnicos

- ✅ Backend Laravel corriendo
- ✅ Todos los servicios Docker activos
- ✅ VITE_BACKEND_URL configurado en .env
- ✅ Base de datos con reparaciones

---

## 📞 Soporte

Si algo no funciona:
1. Verifica que Docker esté corriendo: `docker-compose ps`
2. Revisa la consola del navegador (F12)
3. Confirma que tienes una reparación guardada
4. Intenta recargar la página

---

**¡Listo para usar! 🎉**

Próxima vez que abras una reparación, verás el botón "🔗 Ver Comprobante QR" esperándote.
