<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Partido;
use Illuminate\Database\Seeder;

class PartidoSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar batería previa para evitar duplicados en reseed.
        Partido::query()->delete();

        $hoy = Carbon::today();

        $partidos = [
            // Historial ya jugado
            ['liga_id' => 1, 'club_local_id' => 1, 'club_visitante_id' => 2, 'dias' => -28, 'resultado' => '2-1', 'arbitro' => 'arbitro1'],
            ['liga_id' => 1, 'club_local_id' => 2, 'club_visitante_id' => 3, 'dias' => -21, 'resultado' => '1-1', 'arbitro' => 'arbitro2'],
            ['liga_id' => 1, 'club_local_id' => 3, 'club_visitante_id' => 1, 'dias' => -14, 'resultado' => '0-3', 'arbitro' => 'arbitro1'],
            ['liga_id' => 1, 'club_local_id' => 1, 'club_visitante_id' => 3, 'dias' => -10, 'resultado' => '2-2', 'arbitro' => 'arbitro2'],

            // Jugados recientemente (para revisar paneles)
            ['liga_id' => 1, 'club_local_id' => 2, 'club_visitante_id' => 1, 'dias' => -7, 'resultado' => '1-0', 'arbitro' => 'arbitro2'],
            ['liga_id' => 1, 'club_local_id' => 3, 'club_visitante_id' => 2, 'dias' => -3, 'resultado' => '2-3', 'arbitro' => 'arbitro1'],

            // Pendientes de disputarse (sin resultado)
            ['liga_id' => 1, 'club_local_id' => 1, 'club_visitante_id' => 2, 'dias' => 1, 'resultado' => null, 'arbitro' => 'arbitro1'],
            ['liga_id' => 1, 'club_local_id' => 2, 'club_visitante_id' => 3, 'dias' => 3, 'resultado' => null, 'arbitro' => 'arbitro2'],
            ['liga_id' => 1, 'club_local_id' => 3, 'club_visitante_id' => 1, 'dias' => 5, 'resultado' => null, 'arbitro' => 'arbitro1'],

            // Pendientes sin arbitro asignado (para pruebas de admin)
            ['liga_id' => 1, 'club_local_id' => 1, 'club_visitante_id' => 3, 'dias' => 7, 'resultado' => null, 'arbitro' => null],
            ['liga_id' => 1, 'club_local_id' => 2, 'club_visitante_id' => 1, 'dias' => 10, 'resultado' => null, 'arbitro' => null],
            ['liga_id' => 1, 'club_local_id' => 3, 'club_visitante_id' => 2, 'dias' => 14, 'resultado' => null, 'arbitro' => null],
        ];

        foreach ($partidos as $partido) {
            Partido::create([
                'liga_id' => $partido['liga_id'],
                'club_local_id' => $partido['club_local_id'],
                'club_visitante_id' => $partido['club_visitante_id'],
                'fecha' => $hoy->copy()->addDays($partido['dias'])->toDateString(),
                'resultado' => $partido['resultado'],
                'arbitro' => $partido['arbitro'],
            ]);
        }
    }
}
