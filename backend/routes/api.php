<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArbitroController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\JugadorController;
use App\Http\Controllers\Api\LigaController;
use App\Http\Controllers\Api\PartidoController;

// ── Autenticación ──────────────────────────────────────────────────────────────
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login',    [AuthController::class, 'login']);

// ── Clubs (lectura pública) ────────────────────────────────────────────────────
Route::get('clubs',        [ClubController::class, 'index']);
Route::get('clubs/{club}', [ClubController::class, 'show']);

// ── Jugadores (CRUD público) ───────────────────────────────────────────────────
Route::get('jugadores',             [JugadorController::class, 'index']);
Route::get('jugadores/{jugador}',   [JugadorController::class, 'show']);
Route::post('jugadores',            [JugadorController::class, 'store']);
Route::put('jugadores/{jugador}',   [JugadorController::class, 'update']);
Route::delete('jugadores/{jugador}',[JugadorController::class, 'destroy']);

// ── Ligas (lectura pública) ────────────────────────────────────────────────────
Route::get('ligas',        [LigaController::class, 'index']);
Route::get('ligas/{liga}', [LigaController::class, 'show']);

// ── Partidos (lectura pública) — rutas específicas ANTES de {partido} ─────────
Route::get('partidos/arbitro/{arbitro}', [PartidoController::class, 'porArbitro']);
Route::get('partidos/club/{club}',       [PartidoController::class, 'porClub']);
Route::get('partidos',                   [PartidoController::class, 'index']);
Route::get('partidos/{partido}',         [PartidoController::class, 'show']);

// ── Árbitros (lectura pública) ─────────────────────────────────────────────────
Route::get('arbitros',        [ArbitroController::class, 'index']);
Route::get('arbitros/{user}', [ArbitroController::class, 'show']);

// ── Rutas protegidas (admin) ───────────────────────────────────────────────────
Route::middleware('admin')->group(function () {
    // Clubs
    Route::post('clubs',          [ClubController::class, 'store']);
    Route::put('clubs/{club}',    [ClubController::class, 'update']);
    Route::delete('clubs/{club}', [ClubController::class, 'destroy']);

    // Ligas
    Route::post('ligas',          [LigaController::class, 'store']);
    Route::put('ligas/{liga}',    [LigaController::class, 'update']);
    Route::delete('ligas/{liga}', [LigaController::class, 'destroy']);

    // Partidos
    Route::post('partidos',             [PartidoController::class, 'store']);
    Route::put('partidos/{partido}',    [PartidoController::class, 'update']);
    Route::delete('partidos/{partido}', [PartidoController::class, 'destroy']);
});

