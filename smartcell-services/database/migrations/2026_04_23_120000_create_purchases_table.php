<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_code', 64)->unique();
            $table->date('purchase_date');
            $table->string('supplier_name', 255);
            $table->decimal('total_amount', 14, 2);
            $table->timestamps();
            $table->softDeletes();

            $table->index('purchase_date');
            $table->index('supplier_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
