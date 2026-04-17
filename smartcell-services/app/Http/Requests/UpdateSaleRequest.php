<?php

namespace App\Http\Requests;

use App\Models\Sale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSaleRequest extends FormRequest
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
        $sale = $this->route('sale');

        return [
            'sale_code' => ['sometimes', 'string', 'max:64', Rule::unique('sales', 'sale_code')->ignore($sale)],
            'sale_date' => ['sometimes', 'date'],
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'details' => ['sometimes', 'array', 'min:1'],
            'details.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'details.*.quantity' => ['required', 'integer', 'min:1'],
            'details.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
