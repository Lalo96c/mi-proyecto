<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\DeviceRepair
 */
class DeviceRepairResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'repair_code' => $this->repair_code,
            'client_id' => $this->client_id,
            'client' => $this->whenLoaded('client', fn () => new ClientResource($this->client)),
            'technician_id' => $this->technician_id,
            'technician' => $this->whenLoaded('technician', fn () => new TechnicianResource($this->technician)),
            'device_description' => $this->device_description,
            'fault_description' => $this->fault_description,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'receipt_number' => $this->receipt_number,
            'repair_notes' => $this->repair_notes,
            'images' => $this->images,
            'delivered_at' => $this->delivered_at?->format('Y-m-d'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
