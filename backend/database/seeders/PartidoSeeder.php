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
            // CASO A - Partido ya jugado, sin resultados de capitanes aun.
            // Objetivo: que capitanprueba y capitantigres prueben el flujo desde cero.
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Tigres',
                'dias' => -3,
                'arbitro' => 'arbitro1',
                'resultado' => null,
                'estado' => 'pendiente',
            ],

            // CASO B - Solo envio local, pendiente de visitante.
            [
                'local' => 'Tigres',
                'visitante' => 'Atletico Maestre',
                'dias' => -2,
                'arbitro' => 'arbitro2',
                'resultado' => null,
                'estado' => 'pendiente',
                'resultado_capitan_local' => '2-1',
            ],

            // CASO C - Confirmado por coincidencia de capitanes.
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Tigres',
                'dias' => -8,
                'arbitro' => 'arbitro2',
                'resultado' => '3-2',
                'estado' => 'confirmado',
                'resultado_capitan_local' => '3-2',
                'resultado_capitan_visitante' => '3-2',
            ],

            // CASO D - En revision por discrepancia de capitanes.
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Tigres',
                'dias' => -6,
                'arbitro' => 'arbitro1',
                'resultado' => null,
                'estado' => 'en_revision',
                'resultado_capitan_local' => '1-0',
                'resultado_capitan_visitante' => '0-1',
            ],

            // CASO E - Segundo caso en revision para panel admin.
            [
                'local' => 'Tigres',
                'visitante' => 'Atletico Maestre',
                'dias' => -5,
                'arbitro' => 'arbitro2',
                'resultado' => null,
                'estado' => 'en_revision',
                'resultado_capitan_local' => '2-2',
                'resultado_capitan_visitante' => '1-1',
            ],

            // CASO F - Partido futuro pendiente (no debe permitir envio).
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Tigres',
                'dias' => 2,
                'arbitro' => 'arbitro1',
                'resultado' => null,
                'estado' => 'pendiente',
            ],

            // Partidos adicionales para otros paneles.
            [
                'local' => 'Atletico Maestre',
                'visitante' => 'Deportivo DAM',
                'dias' => 4,
                'arbitro' => 'arbitro2',
                'resultado' => null,
                'estado' => 'pendiente',
            ],
            [
                'local' => 'Tigres',
                'visitante' => 'Deportivo DAM',
                'dias' => 6,
                'arbitro' => null,
                'resultado' => null,
                'estado' => 'pendiente',
            ],
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
