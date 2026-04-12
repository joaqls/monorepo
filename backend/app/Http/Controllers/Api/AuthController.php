<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'usuario' => ['required', 'string', 'min:3', 'max:50', 'unique:users,usuario'],
            'password' => ['required', 'string', 'min:4'],
            'rol' => ['required', Rule::in(['admin', 'usuario', 'capitan', 'arbitro'])],
            'equipo' => ['nullable', 'string', 'max:100'],
        ]);

        if (in_array($data['rol'], ['usuario', 'capitan'], true) && empty($data['equipo'])) {
            return response()->json([
                'message' => 'El equipo es obligatorio para usuario y capitan.',
            ], 422);
        }

        $email = strtolower($data['usuario']).'@liga.local';

        $user = User::create([
            'usuario' => $data['usuario'],
            'name' => $data['usuario'],
            'email' => $email,
            'password' => $data['password'],
            'rol' => $data['rol'],
            'equipo' => $data['equipo'] ?? null,
        ]);

        return response()->json([
            'id' => $user->id,
            'usuario' => $user->usuario,
            'rol' => $user->rol,
            'equipo' => $user->equipo,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'usuario' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('usuario', $credentials['usuario'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Usuario o contraseña incorrectos',
            ], 401);
        }

        return response()->json([
            'id' => $user->id,
            'usuario' => $user->usuario,
            'rol' => $user->rol,
            'equipo' => $user->equipo,
        ]);
    }
}
