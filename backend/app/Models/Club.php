<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'ciudad', 'categoria'];

    public function jugadores()
    {
        return $this->hasMany(Jugador::class);
    }

    public function partidosLocal()
    {
        return $this->hasMany(Partido::class, 'club_local_id');
    }

    public function partidosVisitante()
    {
        return $this->hasMany(Partido::class, 'club_visitante_id');
    }
}
