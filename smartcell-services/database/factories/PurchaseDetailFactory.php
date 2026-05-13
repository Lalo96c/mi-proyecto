<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseDetail>
 */
class PurchaseDetailFactory extends Factory
{
    protected $model = PurchaseDetail::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 20);
        $unitPrice = fake()->randomFloat(2, 1, 2500);

        return [
            'purchase_id' => Purchase::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'line_total' => round($quantity * $unitPrice, 2),
        ];
    }
}
