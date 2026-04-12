<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\JugadorController;
use App\Models\Club;
use App\Models\Jugador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class JugadorControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_devuelve_jugadores_con_relacion_club_cargada()
    {
        $club = Club::factory()->create(['nombre' => 'Club Unit']);

        Jugador::factory()->create([
            'posicion' => 'Defensa',
            'dorsal'   => 5,
            'club_id'  => $club->id,
        ]);

        $controller = new JugadorController();
        $result = $controller->index();

        $this->assertCount(1, $result);
        $this->assertTrue($result->first()->relationLoaded('club'));
        $this->assertEquals('Club Unit', $result->first()->club->nombre);
    }

    public function test_store_crea_jugador_cuando_payload_es_valido()
    {
        $club = Club::factory()->create();

        $request = Request::create('/api/jugadores', 'POST', [
            'nombre' => 'Lucia',
            'posicion' => 'Centrocampista',
            'dorsal' => 10,
            'club_id' => $club->id,
        ]);

        $controller = new JugadorController();
        $result = $controller->store($request);

        $this->assertInstanceOf(Jugador::class, $result);
        $this->assertDatabaseHas('jugadors', [
            'nombre' => 'Lucia',
            'posicion' => 'Centrocampista',
            'dorsal' => 10,
            'club_id' => $club->id,
        ]);
    }

    public function test_store_lanza_error_de_validacion_con_payload_invalido()
    {
        $this->expectException(ValidationException::class);

        $request = Request::create('/api/jugadores', 'POST', [
            'nombre' => '',
            'posicion' => '',
            'dorsal' => 'no_es_numero',
            'club_id' => 999999,
        ]);

        $controller = new JugadorController();
        $controller->store($request);
    }

    public function test_show_devuelve_jugador_con_club_cargado()
    {
        $club = Club::factory()->create();

        $jugador = Jugador::factory()->create([
            'club_id' => $club->id,
        ]);

        $controller = new JugadorController();
        $result = $controller->show($jugador);

        $this->assertTrue($result->relationLoaded('club'));
        $this->assertEquals($club->id, $result->club->id);
    }

    public function test_update_modifica_jugador_y_retorna_modelo_actualizado()
    {
        $club = Club::factory()->create();

        $jugador = Jugador::factory()->create([
            'nombre'  => 'Raul',
            'club_id' => $club->id,
        ]);

        $request = Request::create('/api/jugadores/'.$jugador->id, 'PUT', [
            'nombre' => 'Raul Actualizado',
            'dorsal' => 13,
        ]);

        $controller = new JugadorController();
        $result = $controller->update($request, $jugador);

        $this->assertInstanceOf(Jugador::class, $result);
        $this->assertDatabaseHas('jugadors', [
            'id' => $jugador->id,
            'nombre' => 'Raul Actualizado',
            'dorsal' => 13,
        ]);
    }

    public function test_destroy_elimina_jugador_y_retorna_json_correcto()
    {
        $club = Club::factory()->create();

        $jugador = Jugador::factory()->create([
            'club_id' => $club->id,
        ]);

        $controller = new JugadorController();
        $response = $controller->destroy($jugador);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(['mensaje' => 'Jugador eliminado'], $response->getData(true));
        $this->assertDatabaseMissing('jugadors', ['id' => $jugador->id]);
    }
}