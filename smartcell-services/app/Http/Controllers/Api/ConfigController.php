<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /**
     * Retorna la configuración pública incluyendo la URL pública
     * Esto es útil para que el frontend genere URLs correctas en QR
     *
     * @return JsonResponse
     */
    public function getPublicConfig(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'public_url' => config('app.url'),
            'api_url' => config('app.url') . '/api',
            'timezone' => config('app.timezone'),
        ]);
    }
}
