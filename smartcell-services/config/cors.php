<?php

$origins = env('CORS_ALLOWED_ORIGINS');
if ($origins === null || $origins === '') {
    $single = env('FRONTEND_URL', 'http://localhost:3000');
    $allowedOrigins = [$single];
} else {
    $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $origins))));
}

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | Con otro dominio y token Bearer no hace falta credenciales (cookies).
    | Si algún día usas cookies cross-site, habría que revisar esto y SameSite.
    */
    'supports_credentials' => false,

];
