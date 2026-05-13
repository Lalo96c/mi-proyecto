<?php

namespace App\Http\Requests;

use App\Models\InventoryMovement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryMovementRequest extends FormRequest
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
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'type' => ['required', 'string', Rule::in(InventoryMovement::typeValues())],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', Rule::in(InventoryMovement::reasonValues())],
        ];
    }
}