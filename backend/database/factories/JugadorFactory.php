<?php

namespace Database\Factories;

use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

class JugadorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'   => $this->faker->name(),
            'posicion' => $this->faker->randomElement(['Portero', 'Defensa', 'Centrocampista', 'Delantero']),
            'dorsal'   => $this->faker->numberBetween(1, 99),
            'club_id'  => Club::factory(),
        ];
    }
}
