<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::query()->get();
        if ($products->isEmpty()) {
            return;
        }

        $clients = Client::query()->get();
        if ($clients->isEmpty()) {
            return;
        }

        foreach (range(1, 45) as $_) {
            $sale = Sale::query()->create([
                'sale_code' => 'SAL-'.fake()->unique()->numerify('########'),
                'sale_date' => fake()->dateTimeBetween('-14 months', 'now'),
                'client_id' => $clients->random()->id,
                'total_amount' => 0,
            ]);

            $total = 0.0;
            $lineCount = random_int(1, 6);

            for ($l = 0; $l < $lineCount; $l++) {
                /** @var Product $product */
                $product = $products->random();
                $quantity = random_int(1, 8);
                $unitPrice = (float) $product->sale_price;
                $lineTotal = round($quantity * $unitPrice, 2);
                $total += $lineTotal;

                SaleDetail::query()->create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);
            }

            $sale->update(['total_amount' => round($total, 2)]);
        }
    }
}
