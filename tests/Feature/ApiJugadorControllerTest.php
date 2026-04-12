<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Club;
use App\Models\Jugador;

class ApiJugadorControllerTest extends TestCase
{
    use RefreshDatabase;

    // Comprueba que GET /api/jugadores devuelve jugadores con el club embebido
    public function test_index_devuelve_jugadores_con_club()
    {
        $club = Club::factory()->create(['nombre' => 'Club Test']);

        $jugador = Jugador::factory()->create([
            'nombre'  => 'Juan Perez',
            'club_id' => $club->id,
        ]);

        $response = $this->getJson('/api/jugadores');

        $response->assertStatus(200)
            ->assertJsonStructure([
                [
                    'id',
                    'nombre',
                    'posicion',
                    'dorsal',
                    'club_id',
                    'club',
                ]
            ]);

        // comprobar que el club aparece embebido
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals('Club Test', $data[0]['club']['nombre']);
    }

    // Comprueba que GET /api/jugadores/{id} devuelve el jugador con su club
    public function test_show_devuelve_jugador_con_club()
    {
        $club = Club::factory()->create(['nombre' => 'Club Show']);

        $jugador = Jugador::factory()->create([
            'nombre'  => 'Ana Lopez',
            'club_id' => $club->id,
        ]);

        $response = $this->getJson("/api/jugadores/{$jugador->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'nombre',
                'posicion',
                'dorsal',
                'club_id',
                'club',
            ]);

        $this->assertEquals('Club Show', $response->json('club.nombre'));
    }

    // Comprueba que POST /api/jugadores crea un jugador y guarda en BD
    public function test_store_crea_jugador_y_responde_200()
    {
        $club = Club::factory()->create();

        $payload = [
            'nombre' => 'Marco Diaz',
            'posicion' => 'Defensa',
            'dorsal' => 4,
            'club_id' => $club->id,
        ];

        $response = $this->postJson('/api/jugadores', $payload);

        // El controlador devuelve el recurso creado (201)
        $response->assertStatus(201)
            ->assertJsonFragment(['nombre' => 'Marco Diaz']);

        $this->assertDatabaseHas('jugadors', [
            'nombre' => 'Marco Diaz',
            'dorsal' => 4,
            'club_id' => $club->id,
        ]);
    }

    // Comprueba que la validación en store devuelve 422 para payload inválido
    public function test_store_valida_campos_requeridos_y_club_existente()
    {
        // payload vacío -> faltan campos
        $response = $this->postJson('/api/jugadores', []);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors'])
            ->assertJsonValidationErrors(['nombre', 'posicion', 'dorsal', 'club_id']);

        // club_id inexistente -> error de validación
        $payload = [
            'nombre' => 'Test',
            'posicion' => 'Delantero',
            'dorsal' => 7,
            'club_id' => 9999,
        ];

        $response2 = $this->postJson('/api/jugadores', $payload);
        $response2->assertStatus(422)
            ->assertJsonValidationErrors(['club_id']);
    }

    // Comprueba que PUT /api/jugadores/{id} actualiza el jugador en BD
    public function test_update_modifica_jugador_y_responde_200()
    {
        $club = Club::factory()->create();

        $jugador = Jugador::factory()->create([
            'nombre'  => 'Pablo Ramos',
            'club_id' => $club->id,
        ]);

        $payload = ['nombre' => 'Pablo R. actualizado', 'dorsal' => 12];

        $response = $this->putJson("/api/jugadores/{$jugador->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['nombre' => 'Pablo R. actualizado']);

        $this->assertDatabaseHas('jugadors', [
            'id' => $jugador->id,
            'nombre' => 'Pablo R. actualizado',
            'dorsal' => 12,
        ]);
    }

    // Comprueba que DELETE /api/jugadores/{id} elimina el jugador y responde con mensaje
    public function test_destroy_elimina_jugador_y_responde_200()
    {
        $club = Club::factory()->create();

        $jugador = Jugador::factory()->create([
            'nombre'  => 'Eliminar Test',
            'club_id' => $club->id,
        ]);

        $response = $this->deleteJson("/api/jugadores/{$jugador->id}");

        $response->assertStatus(200)
            ->assertJson(['mensaje' => 'Jugador eliminado']);

        $this->assertDatabaseMissing('jugadors', ['id' => $jugador->id]);
    }
}
