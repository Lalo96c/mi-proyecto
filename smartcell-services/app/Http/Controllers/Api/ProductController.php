<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $search = $request->query('search');
        
        $filters = [
            'name' => $request->query('name'),
            'code' => $request->query('code'),
            'category' => $request->query('category'),
            'status' => $request->query('status'),
        ];

        $query = Product::query();
        
        // Si hay búsqueda, usarla con OR en los 3 campos
        if ($search) {
            $query->search($search);
        } else {
            // Si no, usar los filtros individuales con AND
            $query->filter($filters);
        }

        $products = $query
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products);
    }
    public function show(Product $product)
    {
        return new ProductResource($product);
    }
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::query()->create($request->validated());

        // Create initial stock movement if quantity > 0
        if ($product->quantity > 0) {
            InventoryMovement::create([
                'product_id' => $product->id,
                'type' => InventoryMovement::TYPE_ENTRADA,
                'quantity' => $product->quantity,
                'reason' => InventoryMovement::REASON_STOCK_INICIAL,
            ]);
        }

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $product->update($request->validated());

        return new ProductResource($product->fresh());
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
