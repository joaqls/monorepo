<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Compatibilidad temporal para despliegues con cachés antiguos de middleware.
if (!class_exists('Fruitcake\\Cors\\HandleCors') && class_exists(\Illuminate\Http\Middleware\HandleCors::class)) {
    class_alias(\Illuminate\Http\Middleware\HandleCors::class, 'Fruitcake\\Cors\\HandleCors');
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function ($middleware) {
        // Usamos un único middleware CORS para evitar conflictos en deploy.
        $middleware->prepend(\App\Http\Middleware\ApiCorsMiddleware::class);

        // Alias para middleware personalizado
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
