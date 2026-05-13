# Sistema de QR Estático para Comprobantes de Reparación

## 📋 Descripción General

Se ha implementado un sistema de QR estático y único para cada reparación. Este QR codifica la URL de un comprobante detallado que contiene:
- ✅ Información del cliente
- ✅ Detalles del dispositivo y falla reportada
- ✅ Estado de la reparación
- ✅ Imágenes de la reparación
- ✅ Costo total
- ✅ Fecha de registro y técnico asignado
- ✅ QR integrado para compartir fácilmente

---

## 🔧 Cómo Funciona

### Backend (Laravel)

#### 1. **Controlador: RepairReceiptController**
```php
// ruta: app/Http/Controllers/RepairReceiptController.php

public function show($id)
{
    $repair = DeviceRepair::with(['client', 'technician'])->findOrFail($id);
    return view('repair-receipt', ['repair' => $repair]);
}
```

**Responsabilidades:**
- Recibe el ID de la reparación
- Carga los datos del cliente y técnico relacionados
- Retorna la vista del comprobante

#### 2. **Vista Blade: repair-receipt.blade.php**
```
ruta: resources/views/repair-receipt.blade.php
```

**Características:**
- Diseño responsivo y profesional
- Grid de imágenes para la galería
- Información ordenada en secciones
- QR generado dinámicamente desde la URL actual
- Botones para:
  - 📄 Imprimir
  - 📥 Descargar QR
  - ← Volver

#### 3. **Ruta Web**
```php
// routes/web.php
Route::get('/repair-receipt/{id}', [RepairReceiptController::class, 'show'])
    ->name('repair-receipt.show');
```

**URL resultante:** `http://tu-servidor:8000/repair-receipt/{repairId}`

---

### Frontend (React)

#### 1. **Modal de Detalle: DeviceRepairDetailModal.tsx**

**Nuevas características agregadas:**
- Botón "🔗 Ver Comprobante QR" en el footer del modal
- Modal nuevo para mostrar el QR generado
- Función para descargar el QR como PNG
- Función para abrir el comprobante en pestaña nueva

**Código relevante:**
```typescript
// Estado para controlar modal de QR
const [showQRModal, setShowQRModal] = useState(false);
const qrContainerRef = useRef<HTMLDivElement>(null);

// Generar QR con qr-code-styling
useEffect(() => {
  if (!open || !repair || !showQRModal) return;
  
  const receiptUrl = `${backendUrl}/repair-receipt/${repair.id}`;
  
  const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    data: receiptUrl,
    margin: 10,
    type: 'svg',
    dotsOptions: { color: '#667eea', type: 'square' },
    backgroundOptions: { color: '#ffffff' },
  });
  
  qrCode.append(qrContainerRef.current);
}, [open, repair, showQRModal]);

// Descargar QR
const handleDownloadQR = () => {
  const qrCode = (qrContainerRef.current as any)?.__qrCode;
  if (qrCode) {
    qrCode.download({
      name: `comprobante-${repair?.repair_code}`,
      extension: 'png',
    });
  }
};

// Abrir comprobante en nueva ventana
const handleOpenReceipt = () => {
  const receiptUrl = `${backendUrl}/repair-receipt/${repair?.id}`;
  window.open(receiptUrl, '_blank');
};
```

---

## 📱 Flujo de Uso

### 1. **Desde el Panel de Reparaciones**
```
Listado de Reparaciones
    ↓
Clic en Reparación (Abrir modal de detalle)
    ↓
Clic en botón "🔗 Ver Comprobante QR"
    ↓
Se abre modal con QR generado
```

### 2. **En el Modal de QR**
Puedes:
- **📄 Ver Comprobante:** Abre página completa en nueva pestaña
- **📥 Descargar QR:** Descarga imagen PNG del código
- **Cerrar:** Cierra el modal y vuelve a reparación

### 3. **En la Página del Comprobante**
```
http://192.168.18.6:8000/repair-receipt/{repairId}
    ↓
Muestra información completa:
- QR (clickeable para compartir)
- Datos cliente
- Detalles dispositivo
- Imágenes
- Costo
    ↓
Opciones:
- 📄 Imprimir (Ctrl+P)
- 📥 Descargar QR
- ← Volver
```

---

## 🔐 Características Técnicas

### Codificación del QR
El QR codifica exactamente esta URL:
```
http://192.168.18.6:8000/repair-receipt/{numeric_id}
```

**Ventajas:**
- ✅ Única URL por reparación
- ✅ No cambia con el tiempo
- ✅ Fácil de imprimir/compartir
- ✅ Escaneable desde cualquier dispositivo
- ✅ Acceso público (sin autenticación necesaria)

### Estilos del QR
```javascript
{
  width: 250,
  height: 250,
  color_dots: '#667eea' (azul indigo)
  color_background: '#ffffff' (blanco)
  tipo: 'square' (cuadrados en lugar de círculos)
}
```

---

## 📊 Información que Contiene el Comprobante

### Encabezado
- Código de reparación (ej: REP-001)
- Estado actual
- Badges visuales

### Información General
- Código de reparación
- Estado
- Fecha de registro
- Técnico asignado

### Datos del Cliente
- Nombre completo
- Email
- Teléfono
- Documento/RUC

### Dispositivo
- Descripción del dispositivo
- Falla reportada
- Notas técnicas (si existen)

### Imágenes
- Galería responsive
- 2-3 columnas según pantalla
- Fallback si no hay imágenes

### Costo
- Monto total resaltado
- Formato: S/ x,xxx.xx

### Metadatos
- Fecha/hora de generación
- Fechas de creación y actualización

---

## 🖨️ Opciones de Impresión

### Desde el Comprobante
1. Clic en botón **"📄 Imprimir"**
2. Se abre diálogo de impresión del navegador
3. Selecciona impresora
4. Se omiten los botones de acción en impresión

### Desde el Modal QR
1. Clic en **"📄 Ver Comprobante"**
2. Se abre en pestaña nueva
3. Luego usa Ctrl+P o el botón de impresión

---

## 📥 Descargar QR

### Opción 1: Desde Modal QR
1. Clic en botón **"📥 Descargar QR"**
2. Se descarga como: `comprobante-{codigo}.png`
3. Imagen lista para imprimir o compartir

### Opción 2: Desde Comprobante
1. Haz clic en el QR mostrado
2. Clic derecho > Guardar imagen

---

## 🔗 Compartir Comprobante

### Métodos Posibles
1. **Compartir URL directa:**
   ```
   http://192.168.18.6:8000/repair-receipt/123
   ```
   
2. **Compartir QR (imagen PNG):**
   - Descargar desde modal
   - Enviar por email/WhatsApp
   - Imprimir

3. **Acceso desde QR físico:**
   - Imprime el comprobante
   - Cliente escanea con teléfono
   - Ve los detalles en su navegador

---

## 🛠️ Personalización Disponible

### Cambiar Colores del QR
En `DeviceRepairDetailModal.tsx`, línea de opciones QR:
```typescript
dotsOptions: {
  color: '#667eea',  // ← Cambia este color (hex)
  type: 'square',    // ← O usa 'circle'
}
```

### Cambiar Tamaño del QR
```typescript
width: 250,   // ← Ancho en píxeles
height: 250,  // ← Alto en píxeles
```

### Cambiar Estilos del Comprobante
En `resources/views/repair-receipt.blade.php`:
- Colores: Variables CSS en sección `<style>`
- Fuentes: Cambia `Arial` por tu fuente preferida
- Layout: Modifica grid y secciones

---

## ✅ Checklist de Verificación

- [x] Controlador creado y funcionando
- [x] Vista Blade creada con diseño responsivo
- [x] Ruta registrada en web.php
- [x] Frontend con modal de QR
- [x] Generación dinámica de QR
- [x] Descarga de QR como PNG
- [x] Enlace a comprobante en nueva ventana
- [x] Docker reconstruido con cambios
- [x] Todos los servicios ejecutándose

---

## 🐛 Troubleshooting

### QR no aparece en el modal
1. Verifica que `VITE_BACKEND_URL` esté configurado en `.env`
2. Revisa consola del navegador (F12) para errores
3. Asegúrate que la librería qr-code-styling se cargó

### Comprobante muestra "Cliente no disponible"
- La reparación no tiene cliente asociado
- Verifica que se guardó correctamente en base de datos

### Imágenes no aparecen en comprobante
- Verifica que la ruta de imágenes es correcta
- Revisa permisos de carpeta `public/repairs/`
- Comprueba que la reparación tiene imágenes asociadas

### No puedo imprimir
1. Abre el comprobante en navegador
2. Usa Ctrl+P (Windows) o Cmd+P (Mac)
3. Selecciona impresora o PDF

---

## 📝 URLs Importantes

| Elemento | URL |
|----------|-----|
| Comprobante | `http://192.168.18.6:8000/repair-receipt/{id}` |
| API Reparación | `http://192.168.18.6:8000/api/device-repairs/{id}` |
| Frontend | `http://192.168.18.6:3000` |
| PhpMyAdmin | `http://192.168.18.6:8001` |

---

## 🔄 Actualización Futura

Posibles mejoras:
- [ ] Agregar firma digital
- [ ] Enviar comprobante por email
- [ ] Generar PDF directamente
- [ ] Agregar logo de empresa en comprobante
- [ ] Soporte multiidioma
- [ ] QR con mayor capacidad de datos

---

**¡Sistema listo para usar! 🚀**
