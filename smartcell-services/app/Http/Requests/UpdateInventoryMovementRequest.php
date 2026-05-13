<?php

namespace App\Http\Requests;

use App\Models\InventoryMovement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var InventoryMovement $movement */
        $movement = $this->route('inventory_movement');

        return [
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'reason' => ['sometimes', 'string', Rule::in(InventoryMovement::reasonValues())],
        ];
    }
}