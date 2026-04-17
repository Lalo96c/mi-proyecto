<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(0, 500);

        return [
            'code' => fake()->unique()->numerify('PRD-#####'),
            'name' => fake()->words(3, true),
            'category' => fake()->randomElement(['Electronics', 'Food', 'Clothing', 'Home', 'Sports']),
            'quantity' => $quantity,
            'sale_price' => fake()->randomFloat(2, 5, 9999.99),
            'status' => fake()->randomElement(Product::statusValues()),
        ];
    }

    public function conStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => fake()->numberBetween(50, 500),
            'status' => Product::STATUS_CON_STOCK,
        ]);
    }

    public function sinStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => 0,
            'status' => Product::STATUS_SIN_STOCK,
        ]);
    }

    public function stockBajo(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => fake()->numberBetween(1, 10),
            'status' => Product::STATUS_STOCK_BAJO,
        ]);
    }
}
