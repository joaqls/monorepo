<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\JugadorController;
use App\Http\Controllers\Api\LigaController;

// Rutas públicas
Route::get('clubs', [ClubController::class, 'index']);
Route::get('clubs/{club}', [ClubController::class, 'show']);
Route::get('jugadores', [JugadorController::class, 'index']);
Route::get('jugadores/{jugador}', [JugadorController::class, 'show']);
Route::post('jugadores', [JugadorController::class, 'store']);
Route::put('jugadores/{jugador}', [JugadorController::class, 'update']);
Route::delete('jugadores/{jugador}', [JugadorController::class, 'destroy']);
Route::get('ligas', [LigaController::class, 'index']);

// Rutas protegidas (admin)
Route::middleware('admin')->group(function () {
    Route::post('clubs', [ClubController::class, 'store']);
    Route::put('clubs/{club}', [ClubController::class, 'update']);
    Route::delete('clubs/{club}', [ClubController::class, 'destroy']);
});
