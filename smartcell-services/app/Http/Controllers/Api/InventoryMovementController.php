<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryMovementRequest;
use App\Http\Requests\UpdateInventoryMovementRequest;
use App\Http\Resources\InventoryMovementResource;
use App\Models\InventoryMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryMovementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $filters = [
            'type' => $request->query('type'),
            'reason' => $request->query('reason'),
        ];

        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');
        $productId = (int) $request->query('product_id', 0) ?: null;

        $movements = InventoryMovement::query()
            ->with('product')
            ->filter($filters)
            ->filterByProduct($productId)
            ->filterByDateRange($dateFrom, $dateTo)
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return InventoryMovementResource::collection($movements);
    }

    public function show(InventoryMovement $inventoryMovement)
    {
        $inventoryMovement->load('product');
        return new InventoryMovementResource($inventoryMovement);
    }

    public function store(StoreInventoryMovementRequest $request): JsonResponse
    {
        $data = $request->validated();

        $movement = InventoryMovement::query()->create($data);

        // Update product stock based on movement type
        $this->updateProductStock($movement);

        return (new InventoryMovementResource($movement->load('product')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateInventoryMovementRequest $request, InventoryMovement $inventoryMovement): InventoryMovementResource
    {
        $oldQuantity = $inventoryMovement->quantity;
        $oldType = $inventoryMovement->type;

        $inventoryMovement->update($request->validated());

        // Reverse old stock change and apply new one
        $this->reverseProductStockChange($oldType, $oldQuantity, $inventoryMovement->product_id);
        $this->updateProductStock($inventoryMovement);

        return new InventoryMovementResource($inventoryMovement->fresh('product'));
    }

    public function destroy(InventoryMovement $inventoryMovement): JsonResponse
    {
        // Reverse the stock change before deleting
        $this->reverseProductStockChange($inventoryMovement->type, $inventoryMovement->quantity, $inventoryMovement->product_id);

        $inventoryMovement->delete();
        return response()->json(null, 204);
    }

    private function updateProductStock(InventoryMovement $movement): void
    {
        $product = $movement->product;

        if ($movement->type === InventoryMovement::TYPE_ENTRADA) {
            $product->increment('quantity', $movement->quantity);
        } elseif ($movement->type === InventoryMovement::TYPE_SALIDA) {
            $product->decrement('quantity', $movement->quantity);
        }
    }

    private function reverseProductStockChange(string $type, int $quantity, int $productId): void
    {
        $product = \App\Models\Product::find($productId);

        if ($type === InventoryMovement::TYPE_ENTRADA) {
            $product->decrement('quantity', $quantity);
        } elseif ($type === InventoryMovement::TYPE_SALIDA) {
            $product->increment('quantity', $quantity);
        }
    }
}