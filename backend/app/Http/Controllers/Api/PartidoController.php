<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Partido;
use Illuminate\Http\Request;

class PartidoController extends Controller
{
    public function index()
    {
        return Partido::with(['liga', 'clubLocal', 'clubVisitante'])
            ->orderBy('fecha')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'liga_id'           => 'required|exists:ligas,id',
            'club_local_id'     => 'required|exists:clubs,id',
            'club_visitante_id' => 'required|exists:clubs,id|different:club_local_id',
            'fecha'             => 'required|date',
            'arbitro'           => 'nullable|string|max:100',
            'resultado'         => 'nullable|string|max:20',
        ]);

        return response()->json(
            Partido::create($request->only([
                'liga_id', 'club_local_id', 'club_visitante_id', 'fecha', 'arbitro', 'resultado',
            ])),
            201
        );
    }

    public function show(Partido $partido)
    {
        return $partido->load(['liga', 'clubLocal', 'clubVisitante']);
    }

    public function update(Request $request, Partido $partido)
    {
        $request->validate([
            'liga_id'           => 'sometimes|exists:ligas,id',
            'club_local_id'     => 'sometimes|exists:clubs,id',
            'club_visitante_id' => 'sometimes|exists:clubs,id',
            'fecha'             => 'sometimes|date',
            'arbitro'           => 'nullable|string|max:100',
            'resultado'         => 'nullable|string|max:20',
        ]);

        $partido->update($request->only([
            'liga_id', 'club_local_id', 'club_visitante_id', 'fecha', 'arbitro', 'resultado',
        ]));

        return $partido->load(['liga', 'clubLocal', 'clubVisitante']);
    }

    public function destroy(Partido $partido)
    {
        $partido->delete();
        return response()->json(['mensaje' => 'Partido eliminado']);
    }

    /**
     * Filtrar partidos por nombre del árbitro.
     */
    public function porArbitro(string $arbitro)
    {
        $partidos = Partido::with(['liga', 'clubLocal', 'clubVisitante'])
            ->where('arbitro', $arbitro)
            ->orderBy('fecha')
            ->get();

        return response()->json($partidos);
    }

    /**
     * Filtrar partidos en los que participa un club (local o visitante).
     */
    public function porClub(Club $club)
    {
        $partidos = Partido::with(['liga', 'clubLocal', 'clubVisitante'])
            ->where(function ($q) use ($club) {
                $q->where('club_local_id', $club->id)
                  ->orWhere('club_visitante_id', $club->id);
            })
            ->orderBy('fecha')
            ->get();

        return response()->json($partidos);
    }
}
