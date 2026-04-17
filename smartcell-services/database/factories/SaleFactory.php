<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sale>
 */
class SaleFactory extends Factory
{
    protected $model = Sale::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sale_code' => 'SAL-'.fake()->unique()->numerify('######'),
            'sale_date' => fake()->dateTimeBetween('-18 months', 'now')->format('Y-m-d'),
            'client_id' => Client::factory(),
            'total_amount' => fake()->randomFloat(2, 25, 9999.99),
        ];
    }
}
