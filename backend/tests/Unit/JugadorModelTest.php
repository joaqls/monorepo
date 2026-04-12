<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Jugador;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JugadorModelTest extends TestCase
{
    use RefreshDatabase;
    // Comprueba que los campos asignables son los esperados
    public function test_fillable_contiene_campos_esperados()
    {
        $model = new Jugador();

        $this->assertEquals(
            ['nombre', 'posicion', 'dorsal', 'club_id'],
            $model->getFillable()
        );
    }

    // Comprueba que la relación club() es una relación BelongsTo
    public function test_relacion_club_es_belongs_to()
    {
        $relation = (new Jugador())->club();

        $this->assertInstanceOf(BelongsTo::class, $relation);
    }

    // Ejemplo de uso de factory: crea un jugador (con su club) y verifica que persiste
    public function test_factory_crea_jugador_en_base_de_datos()
    {
        $jugador = Jugador::factory()->create();

        $this->assertDatabaseHas('jugadors', ['id' => $jugador->id]);
    }

    // Ejemplo de factory con count(): crea varios jugadores y verifica la cantidad
    public function test_factory_count_crea_multiples_jugadores()
    {
        Jugador::factory()->count(3)->create();

        $this->assertDatabaseCount('jugadors', 3);
    }
}
