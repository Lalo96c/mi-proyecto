<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $sales = Sale::query()
            ->with(['client', 'saleDetails.product'])
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return SaleResource::collection($sales);
    }

    public function show($id): SaleResource
    {
        $sale = Sale::findOrFail($id);

        $sale->load(['client', 'saleDetails.product']);

        return new SaleResource($sale);
    }

    public function store(StoreSaleRequest $request): JsonResponse
    {
        $data = $request->validated();

        $sale = DB::transaction(function () use ($data) {
            $productIds = collect($data['details'])
                ->pluck('product_id')
                ->unique()
                ->all();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $sale = Sale::query()->create([
                'sale_code' => $data['sale_code'],
                'sale_date' => $data['sale_date'],
                'client_id' => $data['client_id'],
                'total_amount' => 0,
            ]);

            $total = 0.0;

            foreach ($data['details'] as $item) {
                $product = $products[$item['product_id']] ?? null;

                if (! $product) {
                    throw ValidationException::withMessages([
                        'details' => ["Producto no encontrado: {$item['product_id']}"] ,
                    ]);
                }

                $quantity = (int) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];

                if ($product->quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'details' => ["Stock insuficiente para el producto {$product->name}"],
                    ]);
                }

                $product->decrement('quantity', $quantity);

                $lineTotal = round($quantity * $unitPrice, 2);

                SaleDetail::query()->create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);

                $total += $lineTotal;
            }

            $sale->update(['total_amount' => round($total, 2)]);

            return $sale->fresh(['client', 'saleDetails.product']);
        });

        return (new SaleResource($sale))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateSaleRequest $request, $id): SaleResource
    {
        $sale = Sale::findOrFail($id);

        $data = $request->validated();

        $sale = DB::transaction(function () use ($sale, $data) {
            $header = collect($data)->only(['sale_code', 'sale_date', 'client_id'])->all();

            if ($header !== []) {
                $sale->update($header);
            }

            if (isset($data['details'])) {
                $existingProductIds = $sale->saleDetails->pluck('product_id');
                $newProductIds = collect($data['details'])->pluck('product_id');

                $productIds = $existingProductIds
                    ->merge($newProductIds)
                    ->unique()
                    ->all();

                $products = Product::query()
                    ->whereIn('id', $productIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                foreach ($sale->saleDetails as $detail) {
                    $product = $products[$detail->product_id] ?? null;

                    if ($product) {
                        $product->increment('quantity', $detail->quantity);
                    }
                }

                $sale->saleDetails()->delete();

                $total = 0.0;

                foreach ($data['details'] as $item) {
                    $product = $products[$item['product_id']] ?? null;

                    if (! $product) {
                        throw ValidationException::withMessages([
                            'details' => ["Producto no encontrado: {$item['product_id']}"] ,
                        ]);
                    }

                    $quantity = (int) $item['quantity'];
                    $unitPrice = (float) $item['unit_price'];

                    if ($product->quantity < $quantity) {
                        throw ValidationException::withMessages([
                            'details' => ["Stock insuficiente para el producto {$product->name}"],
                        ]);
                    }

                    $product->decrement('quantity', $quantity);

                    $lineTotal = round($quantity * $unitPrice, 2);

                    SaleDetail::query()->create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'line_total' => $lineTotal,
                    ]);

                    $total += $lineTotal;
                }

                $sale->update(['total_amount' => round($total, 2)]);
            }

            return $sale->fresh(['client', 'saleDetails.product']);
        });

        return new SaleResource($sale);
    }

    public function destroy($id): JsonResponse
    {
        $sale = Sale::findOrFail($id);

        DB::transaction(function () use ($sale) {
            $productIds = $sale->saleDetails->pluck('product_id')->unique()->all();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($sale->saleDetails as $detail) {
                $product = $products[$detail->product_id] ?? null;

                if ($product) {
                    $product->increment('quantity', $detail->quantity);
                }
            }

            $sale->delete();
        });

        return response()->json(null, 204);
    }
}
