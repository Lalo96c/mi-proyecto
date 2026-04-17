<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'API Laravel',
        'docs' => 'Define tus rutas en routes/api.php (prefijo /api).',
    ]);
});
