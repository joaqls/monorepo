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
        $club->update($request->all());
        return $club;
    }

    public function destroy(Club $club)
    {
        $club->delete();
        return response()->json(['mensaje' => 'Club eliminado']);
    }
}
