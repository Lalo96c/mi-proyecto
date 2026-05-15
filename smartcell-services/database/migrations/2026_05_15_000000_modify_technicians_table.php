<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('technicians', function (Blueprint $table) {
            // Agregar dni si no existe
            if (!Schema::hasColumn('technicians', 'dni')) {
                $table->string('dni', 20)->after('name')->nullable();
            }
        });

        // Eliminar email si existe
        if (Schema::hasColumn('technicians', 'email')) {
            Schema::table('technicians', function (Blueprint $table) {
                // Eliminar índice único si existe
                try {
                    $table->dropUnique(['email']);
                } catch (\Exception $e) {
                    // Ignorar si no existe
                }
            });

            // Eliminar columna email
            Schema::table('technicians', function (Blueprint $table) {
                $table->dropColumn('email');
            });
        }
    }

    public function down(): void
    {
        Schema::table('technicians', function (Blueprint $table) {
            if (Schema::hasColumn('technicians', 'dni')) {
                $table->dropColumn('dni');
            }
            
            if (!Schema::hasColumn('technicians', 'email')) {
                $table->string('email', 255)->unique();
            }
        });
    }
};

