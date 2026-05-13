<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseRequest extends FormRequest
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
        $purchaseId = $this->route('purchase');

        return [
            'purchase_code' => ['sometimes', 'string', 'max:64', "unique:purchases,purchase_code,{$purchaseId}"],
            'purchase_date' => ['sometimes', 'date'],
            'supplier_name' => ['sometimes', 'string', 'max:255'],
            'details' => ['sometimes', 'array', 'min:1'],
            'details.*.product_id' => ['required_with:details', 'integer', 'exists:products,id'],
            'details.*.quantity' => ['required_with:details', 'integer', 'min:1'],
            'details.*.unit_price' => ['required_with:details', 'numeric', 'min:0'],
        ];
    }
}
