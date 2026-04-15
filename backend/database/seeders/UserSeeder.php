<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->delete();

        $users = [
            [
                'usuario' => 'admin1',
                'name' => 'admin1',
                'email' => 'admin1@liga.local',
                'password' => 'adminpass',
                'rol' => 'admin',
                'equipo' => null,
            ],
            [
                'usuario' => 'usuario1',
                'name' => 'usuario1',
                'email' => 'usuario1@liga.local',
                'password' => 'usuario123',
                'rol' => 'usuario',
                'equipo' => 'Atletico Maestre',
            ],
            [
                'usuario' => 'capitanprueba',
                'name' => 'capitanprueba',
                'email' => 'capitanprueba@liga.local',
                'password' => 'secreto123',
                'rol' => 'capitan',
                'equipo' => 'Atletico Maestre',
            ],
            [
                'usuario' => 'usuario2',
                'name' => 'usuario2',
                'email' => 'usuario2@liga.local',
                'password' => 'usuario123',
                'rol' => 'usuario',
                'equipo' => 'Tigres',
            ],
            [
                'usuario' => 'capitantigres',
                'name' => 'capitantigres',
                'email' => 'capitantigres@liga.local',
                'password' => 'secreto123',
                'rol' => 'capitan',
                'equipo' => 'Tigres',
            ],
            [
                'usuario' => 'arbitro1',
                'name' => 'arbitro1',
                'email' => 'arbitro1@liga.local',
                'password' => 'arbitro123',
                'rol' => 'arbitro',
                'equipo' => null,
            ],
            [
                'usuario' => 'arbitro2',
                'name' => 'arbitro2',
                'email' => 'arbitro2@liga.local',
                'password' => 'arbitro123',
                'rol' => 'arbitro',
                'equipo' => null,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}