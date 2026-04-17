<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('dni', 32)->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->timestamps();

            $table->index('last_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
