<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jugador;
use Illuminate\Http\Request;

class JugadorController extends Controller
{
    public function index()
    {
        return Jugador::with('club')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'posicion' => 'required',
            'dorsal' => 'required|integer',
            'club_id' => 'required|exists:clubs,id',
        ]);

        return Jugador::create($request->all());
    }

    public function show(Jugador $jugador)
    {
        return $jugador->load('club');
    }

    public function update(Request $request, Jugador $jugador)
    {
        $request->validate([
            'nombre'   => 'sometimes|string|max:100',
            'posicion' => 'sometimes|string|max:50',
            'dorsal'   => 'sometimes|integer',
            'club_id'  => 'sometimes|exists:clubs,id',
        ]);

        $jugador->update($request->only(['nombre', 'posicion', 'dorsal', 'club_id']));
        return $jugador;
    }

    public function destroy(Jugador $jugador)
    {
        $jugador->delete();
        return response()->json(['mensaje' => 'Jugador eliminado']);
    }
}
