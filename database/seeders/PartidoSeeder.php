<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partido;

class PartidoSeeder extends Seeder
{
    public function run(): void
    {
        Partido::create([
            'liga_id' => 1,
            'club_local_id' => 1,
            'club_visitante_id' => 2,
            'fecha' => '2026-02-10',
            'resultado' => '2-1'
        ]);

        Partido::create([
            'liga_id' => 1,
            'club_local_id' => 2,
            'club_visitante_id' => 3,
            'fecha' => '2026-02-17',
            'resultado' => '1-1'
        ]);
    }
}
