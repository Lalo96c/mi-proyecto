<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Sale
 */
class SaleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sale_code' => $this->sale_code,
            'sale_date' => $this->sale_date?->format('Y-m-d'),
            'client_id' => $this->client_id,
            'client' => $this->whenLoaded('client', fn () => new ClientResource($this->client)),
            'total_amount' => $this->total_amount,
            'detail' => $this->whenLoaded('saleDetails', fn () => SaleDetailResource::collection($this->saleDetails)),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
