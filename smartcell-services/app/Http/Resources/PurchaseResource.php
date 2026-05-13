<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Purchase
 */
class PurchaseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'purchase_code' => $this->purchase_code,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),
            'supplier_name' => $this->supplier_name,
            'total_amount' => $this->total_amount,
            'detail' => $this->whenLoaded('purchaseDetails', fn () => PurchaseDetailResource::collection($this->purchaseDetails)),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
