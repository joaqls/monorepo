<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partidos', function (Blueprint $table) {
            $table->string('ubicacion')->nullable()->after('arbitro');
            $table->string('resultado_capitan_local')->nullable()->after('ubicacion');
            $table->string('resultado_capitan_visitante')->nullable()->after('resultado_capitan_local');
            $table->string('estado')->default('pendiente')->after('resultado_capitan_visitante');
        });

        DB::table('partidos')
            ->whereNotNull('resultado')
            ->update(['estado' => 'confirmado']);
    }

    public function down(): void
    {
        Schema::table('partidos', function (Blueprint $table) {
            $table->dropColumn([
                'ubicacion',
                'resultado_capitan_local',
                'resultado_capitan_visitante',
                'estado',
            ]);
        });
    }
};