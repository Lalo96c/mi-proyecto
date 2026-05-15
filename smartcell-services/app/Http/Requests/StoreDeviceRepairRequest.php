<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceRepairRequest extends FormRequest
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
            'repair_code' => ['nullable', 'string', 'max:64'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'technician_id' => ['nullable', 'integer', 'exists:technicians,id'],
            'device_type' => ['required', 'string', 'max:64'],
            'device_description' => ['required', 'string', 'max:255'],
            'device_lock' => ['nullable', 'string', 'max:128'],
            'fault_description' => ['required', 'string'],
            'status' => ['required', 'in:recibido,en_reparacion,reparado,entregado'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'receipt_number' => ['nullable', 'string', 'max:64'],
            'repair_notes' => ['nullable', 'string'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['nullable', 'array:name,path,url'],
            'images.*.name' => ['required_with:images', 'string'],
            'images.*.path' => ['required_with:images', 'string'],
            'images.*.url' => ['required_with:images', 'url'],
            'tools_used' => ['nullable', 'array'],
            'tools_used.*' => ['string', 'max:64'],
        ];
    }
}
