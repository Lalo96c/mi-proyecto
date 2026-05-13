<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de Reparación - {{ $repair->repair_code }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .qr-section {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .qr-section img {
            width: 150px;
            height: 150px;
            border: 2px solid #667eea;
            padding: 5px;
            background: white;
        }
        .repair-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .info-block {
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }
        .info-block h3 {
            color: #333;
            font-size: 12px;
            text-transform: uppercase;
            color: #667eea;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .info-block p {
            color: #333;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .info-block .value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .client-info {
            background: #f0f4ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        .client-info h2 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }
        .client-info p {
            color: #333;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .device-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .device-section h3 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 12px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        .device-section p {
            color: #333;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .images-section {
            margin-bottom: 30px;
        }
        .images-section h3 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
        }
        .image-item {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 6px;
            overflow: hidden;
            border: 2px solid #ddd;
        }
        .image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .no-images {
            color: #999;
            font-style: italic;
            padding: 15px;
            text-align: center;
            background: #f5f5f5;
            border-radius: 6px;
        }
        .cost-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: right;
        }
        .cost-section p {
            font-size: 12px;
            margin-bottom: 8px;
            opacity: 0.9;
        }
        .cost-section .amount {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-recibido {
            background: #e3f2fd;
            color: #1976d2;
        }
        .status-en_reparacion {
            background: #fff3e0;
            color: #f57c00;
        }
        .status-reparado {
            background: #e8f5e9;
            color: #388e3c;
        }
        .status-entregado {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
        }
        .actions {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
        .btn-secondary {
            background: #6c757d;
        }
        .btn-secondary:hover {
            background: #5a6268;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
            }
            .actions {
                display: none;
            }
            .btn {
                display: none;
            }
        }
        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }
            .repair-info {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .cost-section {
                text-align: center;
            }
            .header h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Comprobante de Reparación</h1>
            <p>Código: <strong>{{ $repair->repair_code }}</strong></p>
        </div>

        <!-- QR Code -->
        <div class="qr-section">
            <img id="qr-image" src="" alt="QR Code" style="width: 150px; height: 150px; border: 2px solid #667eea; padding: 5px;">
        </div>

        <!-- Info General -->
        <div class="repair-info">
            <div class="info-block">
                <h3>Código de Reparación</h3>
                <p class="value">{{ $repair->repair_code }}</p>
            </div>
            <div class="info-block">
                <h3>Estado</h3>
                <p>
                    <span class="status-badge status-{{ $repair->status }}">
                        {{ ucfirst(str_replace('_', ' ', $repair->status)) }}
                    </span>
                </p>
            </div>
            <div class="info-block">
                <h3>Fecha de Registro</h3>
                <p class="value">{{ $repair->created_at->format('d/m/Y H:i') }}</p>
            </div>
            <div class="info-block">
                <h3>Técnico Asignado</h3>
                <p class="value">
                    {{ $repair->technician ? $repair->technician->name : 'Sin asignar' }}
                </p>
            </div>
        </div>

        <!-- Cliente -->
        <div class="client-info">
            <h2>Información del Cliente</h2>
            @if($repair->client)
                <p><strong>Nombre:</strong> {{ $repair->client->first_name }} {{ $repair->client->last_name }}</p>
                <p><strong>Teléfono:</strong> {{ $repair->client->phone ?? 'N/A' }}</p>
                <p><strong>DNI:</strong> {{ $repair->client->dni ?? 'N/A' }}</p>
            @else
                <p>Cliente no disponible</p>
            @endif
        </div>

        <!-- Dispositivo y Falla -->
        <div class="device-section">
            <h3>Detalles del Dispositivo</h3>
            <p><strong>Dispositivo:</strong> {{ $repair->device_description }}</p>
            <p><strong>Falla Reportada:</strong> {{ $repair->fault_description }}</p>
            @if($repair->repair_notes)
                <p><strong>Notas:</strong> {{ $repair->repair_notes }}</p>
            @endif
        </div>

        <!-- Imágenes -->
        @if($repair->images && count($repair->images) > 0)
            <div class="images-section">
                <h3>Imágenes de la Reparación</h3>
                <div class="images-grid">
                    @foreach($repair->images as $image)
                        <div class="image-item">
                            <img src="{{ $image['url'] }}" alt="{{ $image['name'] }}" loading="lazy">
                        </div>
                    @endforeach
                </div>
            </div>
        @else
            <div class="images-section">
                <h3>Imágenes de la Reparación</h3>
                <div class="no-images">No hay imágenes disponibles</div>
            </div>
        @endif

        <!-- Costo -->
        <div class="cost-section">
            <p>Costo Total de la Reparación</p>
            <div class="amount">
                S/ {{ number_format($repair->total_amount, 2, '.', ',') }}
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Este comprobante fue generado el {{ now()->format('d/m/Y H:i:s') }}</p>
            <p>Para consultas, contacta al soporte técnico.</p>
        </div>

        <!-- Acciones -->
        <div class="actions">
            <button class="btn" onclick="window.print()">📄 Imprimir</button>
            <button class="btn btn-secondary" onclick="downloadQR()">📥 Descargar QR</button>
            <button class="btn btn-secondary" onclick="window.history.back()">← Volver</button>
        </div>
    </div>

    <script>
        // Generar QR usando API de servidor QR confiable
        document.addEventListener('DOMContentLoaded', function() {
            const qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(window.location.href);
            const qrImage = document.getElementById('qr-image');
            if (qrImage) {
                qrImage.src = qrImageUrl;
                qrImage.style.display = 'block';
            }
        });

        // Descargar QR
        window.downloadQR = function() {
            const link = document.createElement('a');
            link.href = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' + encodeURIComponent(window.location.href);
            link.download = 'comprobante-{{ $repair->repair_code }}.png';
            link.click();
        };
    </script>
</body>
</html>
