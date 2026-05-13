<?php

namespace Database\Seeders;

use App\Models\DeviceRepair;
use Illuminate\Database\Seeder;

class DeviceRepairSeeder extends Seeder
{
    public function run(): void
    {
        DeviceRepair::factory()
            ->count(25)
            ->create();
    }
}
