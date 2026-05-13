<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RepairReceiptController;

Route::get('/', function () {
    return response()->json([
        'message' => 'API Laravel',
        'docs' => 'Define tus rutas en routes/api.php (prefijo /api).',
    ]);
});

// Ruta para la vista Blade de upload de imágenes desde móvil (QR)
Route::get('/images-repair-form/{repairId}', function ($repairId) {
    return view('repair-images-form', ['repairId' => $repairId]);
})->name('images-repair.form');

// Rutas para gestión de imágenes de reparación (sin autenticación)
Route::post('/images-repair/{repairId}', function ($repairId) {
    // Delegar al controlador API
    $controller = new \App\Http\Controllers\Api\ImageRepairController();
    return $controller->store(request(), $repairId);
})->name('images-repair.store');

Route::get('/images-repair/{repairId}', function ($repairId) {
    $controller = new \App\Http\Controllers\Api\ImageRepairController();
    return $controller->show($repairId);
})->name('images-repair.show');

Route::delete('/images-repair/{repairId}/{fileName}', function ($repairId, $fileName) {
    $controller = new \App\Http\Controllers\Api\ImageRepairController();
    return $controller->destroy(request(), $repairId, $fileName);
})->name('images-repair.destroy');

// Ruta para el comprobante de reparación (accesible públicamente)
Route::get('/repair-receipt/{id}', [RepairReceiptController::class, 'show'])
    ->name('repair-receipt.show');
