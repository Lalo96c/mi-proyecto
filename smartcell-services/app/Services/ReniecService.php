<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ReniecService
{
    private string $token;
    private string $apiUrl = 'https://api.decolecta.com/v1/reniec/dni';

    public function __construct()
    {
        $this->token = config('services.reniec.token');
        
        if (!$this->token) {
            throw new \Exception('RENIEC token no configurado. Configura RENIEC_TOKEN en .env');
        }
    }

    public function queryByDni(string $dni): array
    {
        if (!$dni || strlen($dni) < 8) {
            throw new \Exception('DNI inválido');
        }

        $response = Http::withToken($this->token)
            ->get($this->apiUrl, [
                'numero' => $dni,
            ]);

        if (!$response->successful()) {
            throw new \Exception('Error consultando RENIEC: ' . $response->body());
        }

        return $response->json();
    }
}
