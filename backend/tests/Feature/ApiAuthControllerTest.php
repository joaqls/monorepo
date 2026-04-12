<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

dataset('auth_roles', [
    ['admin', null],
    ['usuario', 'Tigres'],
    ['capitan', 'Tigres'],
    ['arbitro', null],
]);

it('registers a user with role and team', function () {
    $response = $this->postJson('/api/auth/register', [
        'usuario' => 'capitan1',
        'password' => 'secreto123',
        'rol' => 'capitan',
        'equipo' => 'Tigres',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'usuario' => 'capitan1',
            'rol' => 'capitan',
            'equipo' => 'Tigres',
        ]);

    $this->assertDatabaseHas('users', [
        'usuario' => 'capitan1',
        'rol' => 'capitan',
        'equipo' => 'Tigres',
    ]);
});

it('logs in with valid credentials and returns role', function () {
    User::create([
        'usuario' => 'admin1',
        'name' => 'admin1',
        'email' => 'admin1@liga.local',
        'password' => 'adminpass',
        'rol' => 'admin',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'usuario' => 'admin1',
        'password' => 'adminpass',
    ]);

    $response->assertOk()
        ->assertJsonFragment([
            'usuario' => 'admin1',
            'rol' => 'admin',
        ]);
});

it('rejects login with invalid credentials', function () {
    $response = $this->postJson('/api/auth/login', [
        'usuario' => 'noexiste',
        'password' => 'x',
    ]);

    $response->assertStatus(401);
});

it('registers users for each supported role', function (string $rol, ?string $equipo) {
    $payload = [
        'usuario' => 'user_'.$rol,
        'password' => 'pass1234',
        'rol' => $rol,
    ];

    if ($equipo !== null) {
        $payload['equipo'] = $equipo;
    }

    $response = $this->postJson('/api/auth/register', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'usuario' => 'user_'.$rol,
            'rol' => $rol,
            'equipo' => $equipo,
        ]);
})->with('auth_roles');

it('requires team for usuario and capitan roles', function (string $rol) {
    $response = $this->postJson('/api/auth/register', [
        'usuario' => 'sin_equipo_'.$rol,
        'password' => 'pass1234',
        'rol' => $rol,
    ]);

    $response->assertStatus(422)
        ->assertJsonFragment([
            'message' => 'El equipo es obligatorio para usuario y capitan.',
        ]);
})->with(['usuario', 'capitan']);

it('rejects register with invalid role', function () {
    $response = $this->postJson('/api/auth/register', [
        'usuario' => 'rol_invalido',
        'password' => 'pass1234',
        'rol' => 'manager',
    ]);

    $response->assertStatus(422);
});
