<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Comprobación simple de rol mediante cabecera HTTP
        if ($request->header('rol') !== 'admin') {
            return response()->json([
                'error' => 'Acceso no autorizado'
            ], 403);
        }

        return $next($request);
    }
}
