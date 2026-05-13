<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cargar Imágenes de Reparación</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .repair-id-info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }

        .repair-id-info p {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .repair-id-info strong {
            color: #333;
            font-size: 18px;
            word-break: break-all;
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
            font-size: 14px;
        }

        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 100%;
        }

        .file-input-wrapper input[type="file"] {
            position: absolute;
            left: -9999px;
        }

        .file-input-label {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
        }

        .images-gallery {
            margin-top: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
        }

        .image-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            background: #f5f5f5;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }

        .image-item:hover {
            transform: scale(1.05);
        }

        .image-item img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            display: block;
        }

        .image-delete-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            padding: 0;
        }

        .image-delete-btn:hover {
            background: #ff3838;
        }

        .image-delete-btn:active {
            transform: scale(0.95);
        }

        .gallery-header {
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }

        .gallery-empty {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 14px;
        }
            cursor: pointer;
            background: #f9f9ff;
            transition: all 0.3s ease;
            font-size: 16px;
            color: #667eea;
            font-weight: 500;
        }

        .file-input-label:hover {
            background: #f0f0ff;
            border-color: #764ba2;
            color: #764ba2;
        }

        .file-input-label span {
            display: block;
        }

        .file-input-label .small {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
            font-weight: normal;
        }

        .message {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }

        .message.loading {
            background: #cce5ff;
            color: #004085;
            border: 1px solid #b8daff;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }

            .header h1 {
                font-size: 22px;
            }

            .file-input-label {
                padding: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📸 Cargar Imágenes</h1>
            <p>Selecciona las fotos de la reparación</p>
        </div>

        <div class="repair-id-info">
            <p>ID de Reparación:</p>
            <strong>{{ $repairId }}</strong>
        </div>

        <div id="message" class="message"></div>

        <form id="imageForm" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label for="images">Selecciona las imágenes</label>
                <div class="file-input-wrapper">
                    <input 
                        type="file" 
                        id="images" 
                        name="image" 
                        accept="image/*"
                    >
                    <label for="images" class="file-input-label">
                        <span>
                            📸 Toma una foto o selecciona de la galería
                            <span class="small">o arrastra un archivo aquí</span>
                        </span>
                    </label>
                </div>
            </div>
        </form>

        <div id="galleryContainer" style="display: none;">
            <div class="gallery-header">📷 Imágenes Subidas</div>
            <div id="imagesGallery" class="images-gallery"></div>
        </div>
    </div>

    <script>
        const imageInput = document.getElementById('images');
        const messageDiv = document.getElementById('message');
        const form = document.getElementById('imageForm');
        const galleryContainer = document.getElementById('galleryContainer');
        const imagesGallery = document.getElementById('imagesGallery');
        let isUploading = false;

        const repairId = '{{ $repairId }}';

        // Cargar imágenes al iniciar
        loadImages();

        // Manejar cambios en el input de archivos
        imageInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                uploadImage(e.target.files[0]);
                imageInput.value = '';
            }
        });

        // Manejar drag and drop
        const label = document.querySelector('.file-input-label');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            label.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            label.addEventListener(eventName, () => {
                label.style.background = '#f0f0ff';
                label.style.borderColor = '#764ba2';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            label.addEventListener(eventName, () => {
                label.style.background = '#f9f9ff';
                label.style.borderColor = '#667eea';
            });
        });

        label.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                uploadImage(files[0]);
            }
        });

        async function loadImages() {
            try {
                const baseUrl = window.location.origin;
                const response = await fetch(`${baseUrl}/api/images-repair/${repairId}`);
                const data = await response.json();
                
                if (data.success && Array.isArray(data.images)) {
                    renderGallery(data.images);
                }
            } catch (error) {
                console.error('Error cargando imágenes:', error);
            }
        }

        function renderGallery(images) {
            imagesGallery.innerHTML = '';
            
            if (images.length === 0) {
                galleryContainer.style.display = 'none';
                return;
            }

            galleryContainer.style.display = 'block';

            images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${image.url}" alt="Imagen cargada">
                    <button type="button" class="image-delete-btn" data-filename="${image.name}" title="Eliminar imagen">
                        ✕
                    </button>
                `;

                imageItem.querySelector('.image-delete-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    deleteImage(image.name, imageItem);
                });

                imagesGallery.appendChild(imageItem);
            });
        }

        async function deleteImage(fileName, imageElement) {
            if (!confirm('¿Eliminar esta imagen?')) return;

            try {
                const baseUrl = window.location.origin;
                const encodedFileName = encodeURIComponent(fileName);
                const response = await fetch(`${baseUrl}/images-repair/${repairId}/${encodedFileName}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    imageElement.style.transition = 'opacity 0.3s';
                    imageElement.style.opacity = '0';
                    setTimeout(() => {
                        imageElement.remove();
                        // Si no hay más imágenes, ocultar galería
                        if (imagesGallery.children.length === 0) {
                            galleryContainer.style.display = 'none';
                        }
                    }, 300);
                    showMessage('✅ Imagen eliminada correctamente', 'success');
                } else {
                    showMessage(`❌ Error: ${data.message}`, 'error');
                }
            } catch (error) {
                showMessage('❌ Error al eliminar la imagen', 'error');
                console.error('Error:', error);
            }
        }

        async function compressImage(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Limitar tamaño máximo a 2048x2048 pero mantener proporción
                        const maxSize = 2048;
                        if (width > height) {
                            if (width > maxSize) {
                                height = Math.round((height * maxSize) / width);
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width = Math.round((width * maxSize) / height);
                                height = maxSize;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob(
                            (blob) => {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: file.lastModified,
                                });
                                console.log(`Imagen comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                                resolve(compressedFile);
                            },
                            'image/jpeg',
                            0.85 // Calidad JPEG
                        );
                    };
                    img.onerror = () => {
                        console.warn('No se pudo cargar la imagen para compresión, usando original');
                        resolve(file);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        async function uploadImage(file) {
            if (isUploading) return;
            
            // Obtener tipo MIME correcto
            let detectedMime = file.type;
            console.log('Archivo seleccionado:', file.name, 'Tipo MIME:', detectedMime, 'Tamaño:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
            
            // Validar extensión - más flexible para fotos de cámara
            const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'heic', 'heif', 'raw', 'bmp', 'tiff'];
            const fileName = file.name.toLowerCase();
            const extension = fileName.split('.').pop();
            
            // Si no tiene extensión pero MIME type es imagen, permitir
            if (!extension) {
                if (!detectedMime || !detectedMime.startsWith('image/')) {
                    showMessage(`❌ Archivo no válido o no es una imagen`, 'error');
                    return;
                }
                console.log('Archivo sin extensión pero detectado como imagen por MIME type:', detectedMime);
            } else if (!allowedExtensions.includes(extension)) {
                // Si tiene extensión pero no está en lista, validar por MIME type
                if (!detectedMime || !detectedMime.startsWith('image/')) {
                    showMessage(`❌ Extensión no permitida: .${extension}`, 'error');
                    return;
                }
                console.log('Extensión .${extension} no en lista pero MIME type válido:', detectedMime);
            }

            // Si no detectó MIME, asumir basado en extensión
            if (!detectedMime) {
                const mimeMap = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                };
                detectedMime = mimeMap[extension] || 'image/jpeg';
                console.log('MIME asumido por extensión:', detectedMime);
            }

            // Validar tamaño - rechazar si es mayor a 100MB sin comprimir
            const maxSizeNoCompress = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSizeNoCompress) {
                showMessage('❌ La imagen es demasiado grande (máximo 100MB)', 'error');
                return;
            }

            isUploading = true;
            showMessage('⏳ Preparando imagen...', 'loading');

            try {
                // Comprimir imagen si es muy grande
                let finalFile = file;
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    showMessage('📦 Comprimiendo imagen (esto puede tomar unos segundos)...', 'loading');
                    finalFile = await compressImage(file);
                }

                console.log('Imagen final:', finalFile.name, 'Tamaño:', (finalFile.size / 1024 / 1024).toFixed(2) + 'MB');
                showMessage('💾 Guardando imagen...', 'loading');

                const formData = new FormData();
                formData.append('image', finalFile, finalFile.name);

                const uploadUrl = '{{ route("images-repair.store", $repairId) }}';
                console.log('Enviando a:', uploadUrl);
                
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json'
                    }
                });

                console.log('Respuesta HTTP:', response.status, response.statusText);
                console.log('Content-Type:', response.headers.get('content-type'));

                const responseText = await response.text();
                console.log('Respuesta completa del servidor:', responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Respuesta no es JSON válido:', responseText.substring(0, 500));
                    console.error('Error al parsear:', e.message);
                    showMessage('❌ Error del servidor: ' + responseText.substring(0, 100), 'error');
                    isUploading = false;
                    return;
                }

                if (data.success) {
                    showMessage(`✅ ${data.message}`, 'success');
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                        loadImages(); // Recargar galería
                    }, 1500);
                } else {
                    const errorMsg = data.message || 'Error desconocido';
                    const errorDetails = data.errors ? ` - ${JSON.stringify(data.errors)}` : '';
                    showMessage(`❌ ${errorMsg}${errorDetails}`, 'error');
                    console.error('Error del servidor:', data);
                }
            } catch (error) {
                showMessage('❌ Error: ' + error.message, 'error');
                console.error('Error en uploadImage:', error);
            } finally {
                isUploading = false;
            }
        }

        function showMessage(text, type) {
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            if (type === 'loading') {
                messageDiv.innerHTML = `<div class="spinner"></div><span>${text}</span>`;
            } else {
                messageDiv.textContent = text;
            }
        }
    </script>
</body>
</html>
