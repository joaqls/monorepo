<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClubFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'    => $this->faker->company(),
            'ciudad'    => $this->faker->city(),
            'categoria' => $this->faker->randomElement(['Senior', 'Juvenil', 'Cadete']),
        ];
    }
}
