<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Purchase>
 */
class PurchaseFactory extends Factory
{
    protected $model = Purchase::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'purchase_code' => 'PUR-'.fake()->unique()->numerify('######'),
            'purchase_date' => fake()->dateTimeBetween('-18 months', 'now')->format('Y-m-d'),
            'supplier_name' => fake()->company(),
            'total_amount' => fake()->randomFloat(2, 25, 9999.99),
        ];
    }
}
