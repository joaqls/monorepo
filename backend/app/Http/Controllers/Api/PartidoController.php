<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Partido;
use App\Models\User;
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
            'ubicacion'         => 'nullable|string|max:150',
        ]);

        $partido = Partido::create(array_merge(
            $request->only([
                'liga_id', 'club_local_id', 'club_visitante_id', 'fecha', 'arbitro', 'resultado', 'ubicacion',
            ]),
            [
                'estado' => $request->filled('resultado') ? 'confirmado' : 'pendiente',
            ]
        ));

        return response()->json(
            $partido->load(['liga', 'clubLocal', 'clubVisitante']),
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
            'ubicacion'         => 'nullable|string|max:150',
        ]);

        $data = $request->only([
            'liga_id', 'club_local_id', 'club_visitante_id', 'fecha', 'arbitro', 'resultado', 'ubicacion',
        ]);

        if ($request->has('resultado')) {
            $data['estado'] = $request->filled('resultado') ? 'confirmado' : 'pendiente';
        }

        $partido->update($data);

        return $partido->load(['liga', 'clubLocal', 'clubVisitante']);
    }

    public function confirmarResultado(Request $request, Partido $partido)
    {
        $data = $request->validate([
            'resultadoLocal' => 'required|integer|min:0',
            'resultadoVisitante' => 'required|integer|min:0',
        ]);

        $partido->update([
            'resultado' => $data['resultadoLocal'].'-'.$data['resultadoVisitante'],
            'estado' => 'confirmado',
        ]);

        return $partido->load(['liga', 'clubLocal', 'clubVisitante']);
    }

    public function enviarResultado(Request $request, Partido $partido)
    {
        if ($request->header('rol') !== 'capitan') {
            return response()->json(['message' => 'Acceso no autorizado'], 403);
        }

        $usuario = $request->header('usuario');
        if (!is_string($usuario) || $usuario === '') {
            return response()->json(['message' => 'Usuario no identificado'], 401);
        }

        $capitan = User::where('usuario', $usuario)
            ->where('rol', 'capitan')
            ->first();

        if (!$capitan || !$capitan->equipo) {
            return response()->json(['message' => 'Capitán no válido'], 403);
        }

        if (strtotime($partido->fecha) > strtotime(now()->toDateString())) {
            return response()->json(['message' => 'El partido aún no se ha jugado'], 422);
        }

        if ($partido->estado === 'confirmado') {
            return response()->json(['message' => 'El partido ya está confirmado'], 422);
        }

        $data = $request->validate([
            'resultado' => ['required', 'regex:/^\d+\-\d+$/'],
        ]);

        $clubLocal = $partido->clubLocal;
        $clubVisitante = $partido->clubVisitante;

        if ($clubLocal && $capitan->equipo === $clubLocal->nombre) {
            $partido->resultado_capitan_local = $data['resultado'];
        } elseif ($clubVisitante && $capitan->equipo === $clubVisitante->nombre) {
            $partido->resultado_capitan_visitante = $data['resultado'];
        } else {
            return response()->json(['message' => 'El capitán no pertenece a este partido'], 403);
        }

        if ($partido->resultado_capitan_local && $partido->resultado_capitan_visitante) {
            if ($partido->resultado_capitan_local === $partido->resultado_capitan_visitante) {
                $partido->resultado = $partido->resultado_capitan_local;
                $partido->estado = 'confirmado';
            } else {
                $partido->resultado = null;
                $partido->estado = 'en_revision';
            }
        } else {
            $partido->estado = 'pendiente';
        }

        $partido->save();

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

    /**
     * Filtrar partidos por nombre de equipo (club local o visitante).
     */
    public function porEquipo(string $equipo)
    {
        $partidos = Partido::with(['liga', 'clubLocal', 'clubVisitante'])
            ->where(function ($query) use ($equipo) {
                $query->whereHas('clubLocal', function ($clubQuery) use ($equipo) {
                    $clubQuery->where('nombre', $equipo);
                })->orWhereHas('clubVisitante', function ($clubQuery) use ($equipo) {
                    $clubQuery->where('nombre', $equipo);
                });
            })
            ->orderBy('fecha')
            ->get();

        return response()->json($partidos);
    }

    /**
     * Listar partidos pendientes de revisión (sin resultado cargado).
     */
    public function enRevision()
    {
        $partidos = Partido::with(['liga', 'clubLocal', 'clubVisitante'])
            ->where('estado', 'en_revision')
            ->orderBy('fecha')
            ->get();

        return response()->json($partidos);
    }
}
