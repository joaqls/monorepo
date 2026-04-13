<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index()
    {
        return Club::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'ciudad' => 'required',
            'categoria' => 'required',
        ]);

        return Club::create($request->all());
    }

    public function show(Club $club)
    {
        return $club->load('jugadores');
    }

    public function update(Request $request, Club $club)
    {
        $request->validate([
            'nombre'    => 'sometimes|string|max:100',
            'ciudad'    => 'sometimes|string|max:100',
            'categoria' => 'sometimes|string|max:50',
        ]);

        $club->update($request->only(['nombre', 'ciudad', 'categoria']));
        return $club;
    }

    public function destroy(Club $club)
    {
        $club->delete();
        return response()->json(['mensaje' => 'Club eliminado']);
    }
}
