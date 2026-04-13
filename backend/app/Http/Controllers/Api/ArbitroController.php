<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class ArbitroController extends Controller
{
    /**
     * Listar todos los usuarios con rol árbitro.
     */
    public function index()
    {
        return User::where('rol', 'arbitro')
            ->select('id', 'usuario', 'rol')
            ->get();
    }

    /**
     * Mostrar un árbitro concreto.
     */
    public function show(User $user)
    {
        if ($user->rol !== 'arbitro') {
            return response()->json(['error' => 'El usuario no es árbitro'], 404);
        }

        return $user->only('id', 'usuario', 'rol');
    }
}
