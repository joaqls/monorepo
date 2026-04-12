<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Liga;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function index()
    {
        return Liga::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'deporte' => 'required',
            'temporada' => 'required',
        ]);

        return Liga::create($request->all());
    }

    public function show(Liga $liga)
    {
        return $liga->load('partidos');
    }

    public function update(Request $request, Liga $liga)
    {
        $liga->update($request->all());
        return $liga;
    }

    public function destroy(Liga $liga)
    {
        $liga->delete();
        return response()->json(['mensaje' => 'Liga eliminada']);
    }
}
