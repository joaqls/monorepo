<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

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
