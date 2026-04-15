<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Liga;

class LigaSeeder extends Seeder
{
    public function run(): void
    {
        Liga::query()->delete();

        Liga::create([
            'nombre' => 'Liga Escolar',
            'deporte' => 'Fútbol',
            'temporada' => '2025/2026'
        ]);
    }
}

