<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        Club::query()->delete();

        $clubs = [
            [
                'nombre' => 'Atletico Maestre',
                'ciudad' => 'Ciudad Real',
                'categoria' => 'Senior',
            ],
            [
                'nombre' => 'Tigres',
                'ciudad' => 'Daimiel',
                'categoria' => 'Senior',
            ],
            [
                'nombre' => 'Deportivo DAM',
                'ciudad' => 'Almagro',
                'categoria' => 'Senior',
            ],
        ];

        foreach ($clubs as $club) {
            Club::create($club);
        }
    }
}
