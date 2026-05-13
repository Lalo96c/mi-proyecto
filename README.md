# 🔧 Sistema de Reparación de Dispositivos - SmartCell

Sistema completo de gestión de reparaciones de dispositivos móviles con interfaz web moderna, generación de QR, y control de inventario.

## 🎯 Características

- ✅ Gestión de reparaciones técnicas
- ✅ Seguimiento de ventas
- ✅ Control de inventario
- ✅ Generación de QR para comprobantes
- ✅ Gestión de clientes y técnicos
- ✅ Panel administrativo intuitivo
- ✅ Almacenamiento de imágenes de reparaciones

## 🛠️ Stack Tecnológico

### Frontend
- **React** 19.2.4 + TypeScript
- **Vite** 8.0.3 (build tool)
- **Tailwind CSS** 4.2.2
- **Axios** para HTTP requests

### Backend
- **Laravel** 11 (PHP 8.4.21)
- **MySQL** base de datos
- **Docker** para containerización
- **JWT** para autenticación

## 📋 Requisitos Previos

- **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop)
- **Node.js** v18+ - [Descargar](https://nodejs.org/)
- **Git** (opcional) - [Descargar](https://git-scm.com/)

## 🚀 Instalación Rápida

### Para Nueva PC o Instalación desde Cero

**⚠️ IMPORTANTE:** Lee la guía completa de instalación:
👉 **[INSTALACION_NUEVA_PC.md](./INSTALACION_NUEVA_PC.md)** 👈

La guía incluye:
1. Cómo obtener tu IP local
2. Configuración del Backend (Laravel + Docker)
3. Configuración del Frontend (React)
4. Verificación de servicios
5. Acceso desde teléfono
6. Solución de problemas

---

## 🎯 Resumen Rápido (si ya conoces el sistema)

```bash
# 1. Obtén tu IP
ipconfig  # Busca IPv4 Address

# 2. Actualiza APP_URL en smartcell-services/.env
APP_URL=http://192.168.1.50:8000  # Cambia 192.168.1.50 por tu IP

# 3. Inicia Docker
cd smartcell-services
docker-compose up -d

# 4. Instala frontend
cd ../smartcell-frontend
npm install
npm run dev

# 5. Accede
# Frontend: http://192.168.1.50:5173
# API: http://192.168.1.50:8000/api
```

---

## 📁 Estructura del Proyecto

```
mi-proyecto/
├── smartcell-frontend/          # React + TypeScript
│   ├── src/
│   │   ├── api/                # Servicios HTTP
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas/vistas
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utilidades
│   ├── package.json
│   └── vite.config.ts
│
├── smartcell-services/          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── routes/
│   │   └── api.php              # Rutas API
│   ├── config/
│   │   ├── app.php
│   │   └── auth.php
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── .env                     # Variables de configuración
│
├── INSTALACION_NUEVA_PC.md      # 📖 Guía de instalación
├── README.md                    # Este archivo
└── .gitignore
```

---

## 🔗 URLs de Acceso

| Servicio | URL |
|----------|-----|
| **Frontend** (React) | `http://TU_IP:5173` |
| **Backend API** | `http://TU_IP:8000/api` |
| **PhpMyAdmin** (BD) | `http://TU_IP:8080` |
| **Comprobantes** | `http://TU_IP:8000/repair-receipt/{id}` |

> Reemplaza `TU_IP` con tu dirección IPv4 local (ej: 192.168.1.50)

---

## 📱 Acceso desde Teléfono

1. **Conecta el teléfono a la misma red WiFi**
2. Abre el navegador y ve a:
   ```
   http://TU_IP:5173
   ```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- **Nunca** hagas push de `.env` a GitHub (está en `.gitignore`)
- Las variables confidenciales (JWT_SECRET, DB_PASSWORD) están protegidas
- El `.gitignore` excluye automáticamente `node_modules`, `vendor`, y logs

---

## 🐛 Solución de Problemas

### Backend no responde
```bash
cd smartcell-services
docker-compose logs laravel
docker-compose ps  # Verifica que esté corriendo
```

### Frontend no encuentra API
- Verifica que `APP_URL` sea correcto en `.env` de Laravel
- Asegúrate de que estén en la misma red WiFi
- Reinicia Docker: `docker-compose restart`

### Base de datos no inicializa
```bash
docker-compose exec laravel php artisan migrate --seed
```

### Puertos en uso
Si los puertos (5173, 8000, 8080) están ocupados:
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :8000
# Cambiar puertos en docker-compose.yml
```

---

## 📝 Notas de Desarrollo

- **Frontend automático**: La URL de API se detecta automáticamente usando `window.location.hostname`
- **Backend flexible**: Solo necesitas cambiar `APP_URL` en `.env` cuando cambies de PC
- **Docker**: Todo está containerizado, solo necesitas Docker Desktop
- **Timezone**: Configurado a `America/Lima` (Perú)

---

## 🤝 Contribuciones

Este es un proyecto privado. Los cambios se sincronizan a través de Git.

Flujo básico:
```bash
git pull origin main
# Hacer cambios
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

---

## 📧 Soporte

Para problemas o dudas sobre la instalación, consulta:
- [INSTALACION_NUEVA_PC.md](./INSTALACION_NUEVA_PC.md) - Guía completa
- Documentación en archivos `.md` del proyecto

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0  
**Estado:** ✅ Production Ready
