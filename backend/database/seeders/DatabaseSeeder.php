<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ClubSeeder::class,
            JugadorSeeder::class,
            LigaSeeder::class,
            PartidoSeeder::class,
        ]);
    }
}
