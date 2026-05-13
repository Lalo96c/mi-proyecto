<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Primero, elimina el índice unique anterior si existe
        try {
            Schema::table('clients', function (Blueprint $table) {
                if (Schema::hasColumn('clients', 'dni')) {
                    $table->dropUnique(['dni']);
                }
            });
        } catch (\Exception $e) {
            // El índice no existe, continuamos
        }

        // Crea un índice único combinando dni y deleted_at
        // Esto permite que los registros eliminados (con deleted_at != NULL) tengan DNI duplicado
        try {
            DB::statement('ALTER TABLE clients ADD UNIQUE KEY clients_dni_unique_active (dni, deleted_at)');
        } catch (\Exception $e) {
            // El índice ya existe, continuamos
        }
    }

    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE clients DROP INDEX clients_dni_unique_active');
        } catch (\Exception $e) {
            // El índice no existe
        }
        
        try {
            Schema::table('clients', function (Blueprint $table) {
                $table->unique('dni');
            });
        } catch (\Exception $e) {
            // El índice ya existe
        }
    }
};
