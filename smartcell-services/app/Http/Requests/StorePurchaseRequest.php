<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
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
            'purchase_code' => ['required', 'string', 'max:64', 'unique:purchases,purchase_code'],
            'purchase_date' => ['required', 'date'],
            'supplier_name' => ['required', 'string', 'max:255'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'details.*.quantity' => ['required', 'integer', 'min:1'],
            'details.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
