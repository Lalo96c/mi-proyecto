<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_repairs', function (Blueprint $table) {
            $table->id();
            $table->string('repair_code', 64)->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained('technicians')->nullOnDelete();
            $table->string('device_description', 255); // ej: "Samsung Galaxy A12"
            $table->text('fault_description'); // Qué problema tiene el dispositivo
            $table->enum('status', ['recibido', 'en_reparacion', 'reparado', 'entregado'])->default('recibido');
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->string('receipt_number', 64)->nullable(); // Boleta
            $table->text('repair_notes')->nullable(); // Notas del técnico
            $table->dateTime('delivered_at')->nullable(); // Fecha de entrega
            $table->timestamps();
            $table->softDeletes();

            $table->index('repair_code');
            $table->index('status');
            $table->index('client_id');
            $table->index('technician_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_repairs');
    }
};
