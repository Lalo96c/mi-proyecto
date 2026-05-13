<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->enum('type', ['entrada', 'salida']);
            $table->unsignedInteger('quantity');
            $table->enum('reason', ['venta', 'compra', 'uso_tecnico', 'stock_inicial', 'ajuste_positivo', 'ajuste_negativo']);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['product_id', 'created_at']);
            $table->index('type');
            $table->index('reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};