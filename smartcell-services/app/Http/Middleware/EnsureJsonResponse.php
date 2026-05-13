<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forzar que acepte JSON
        $request->headers->set('Accept', 'application/json');
        
        $response = $next($request);

        // Si no es una respuesta JSON válida, convertirla
        if (!$response->headers->get('content-type') || strpos($response->headers->get('content-type'), 'application/json') === false) {
            // Si es una respuesta de error HTML, convertir a JSON
            if ($response->getStatusCode() >= 400) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error del servidor',
                    'status' => $response->getStatusCode(),
                ], $response->getStatusCode());
            }
        }

        return $response;
    }
}
