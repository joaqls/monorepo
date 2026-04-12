<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        Club::create([
            'nombre' => 'Atlético Maestre',
            'ciudad' => 'Ciudad Real',
            'categoria' => 'Senior'
        ]);

        Club::create([
            'nombre' => 'Calatrava FC',
            'ciudad' => 'Daimiel',
            'categoria' => 'Juvenil'
        ]);

        Club::create([
            'nombre' => 'Deportivo DAM',
            'ciudad' => 'Almagro',
            'categoria' => 'Senior'
        ]);
    }
}
