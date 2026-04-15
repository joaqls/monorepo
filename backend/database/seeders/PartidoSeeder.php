<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Club;
use App\Models\Liga;
use App\Models\Partido;
use Illuminate\Database\Seeder;

class PartidoSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar batería previa para evitar duplicados en reseed.
        Partido::query()->delete();

        $hoy = Carbon::today();
        $ligaId = Liga::query()->value('id');

        $clubsByName = Club::query()
            ->pluck('id', 'nombre')
            ->all();

        $partidos = [
            // Confirmados ya jugados
            ['local' => 'Atletico Maestre', 'visitante' => 'Tigres', 'dias' => -10, 'arbitro' => 'arbitro2', 'resultado' => '2-1', 'estado' => 'confirmado'],
            ['local' => 'Deportivo DAM', 'visitante' => 'Atletico Maestre', 'dias' => -5, 'arbitro' => 'arbitro1', 'resultado' => '1-1', 'estado' => 'confirmado'],

            // En revision: ambos capitanes enviaron resultado distinto
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Tigres',
                'dias' => -2,
                'arbitro' => 'arbitro2',
                'resultado' => null,
                'estado' => 'en_revision',
                'resultado_capitan_local' => '1-0',
                'resultado_capitan_visitante' => '0-1',
            ],

            // Pendientes para ambos equipos
            ['local' => 'Tigres', 'visitante' => 'Atletico Maestre', 'dias' => 2, 'arbitro' => 'arbitro1', 'resultado' => null, 'estado' => 'pendiente'],
            ['local' => 'Atletico Maestre', 'visitante' => 'Deportivo DAM', 'dias' => 4, 'arbitro' => 'arbitro2', 'resultado' => null, 'estado' => 'pendiente'],
            ['local' => 'Tigres', 'visitante' => 'Deportivo DAM', 'dias' => 6, 'arbitro' => null, 'resultado' => null, 'estado' => 'pendiente'],
        ];

        foreach ($partidos as $partido) {
            $clubLocalId = $clubsByName[$partido['local']] ?? null;
            $clubVisitanteId = $clubsByName[$partido['visitante']] ?? null;

            if (!$ligaId || !$clubLocalId || !$clubVisitanteId) {
                continue;
            }

            Partido::create([
                'liga_id' => $ligaId,
                'club_local_id' => $clubLocalId,
                'club_visitante_id' => $clubVisitanteId,
                'fecha' => $hoy->copy()->addDays($partido['dias'])->toDateString(),
                'resultado' => $partido['resultado'],
                'arbitro' => $partido['arbitro'],
                'estado' => $partido['estado'],
                'resultado_capitan_local' => $partido['resultado_capitan_local'] ?? null,
                'resultado_capitan_visitante' => $partido['resultado_capitan_visitante'] ?? null,
            ]);
        }
    }
}
