<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Invitados sin sesión web: redirige a /. Las rutas /api/* no usan esto si la respuesta es JSON.
        $middleware->redirectGuestsTo(fn () => '/');
        
        // Registrar middleware custom para asegurar JSON en rutas de imagen
        $middleware->append(\App\Http\Middleware\EnsureJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * Sin esto, peticiones a /api/* sin Accept: application/json pueden tratarse como "no JSON".
         * El middleware auth entonces lanza redirect a / y acabas viendo el JSON de web.php (GET /).
         */
        $exceptions->shouldRenderJsonWhen(function ($request, \Throwable $e) {
            return $request->is('api/*');
        });
    })->create();
