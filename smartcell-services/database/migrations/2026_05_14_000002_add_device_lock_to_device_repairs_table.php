<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('device_repairs', function (Blueprint $table) {
            $table->string('device_lock', 128)->nullable()->after('device_type');
        });
    }

    public function down(): void
    {
        Schema::table('device_repairs', function (Blueprint $table) {
            $table->dropColumn('device_lock');
        });
    }
};
