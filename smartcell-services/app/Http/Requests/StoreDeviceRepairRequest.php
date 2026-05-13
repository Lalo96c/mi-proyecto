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
            'repair_code' => ['required', 'string', 'max:64', 'unique:device_repairs,repair_code'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'technician_id' => ['nullable', 'integer', 'exists:technicians,id'],
            'device_description' => ['required', 'string', 'max:255'],
            'fault_description' => ['required', 'string'],
            'status' => ['required', 'in:recibido,en_reparacion,reparado,entregado'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'receipt_number' => ['nullable', 'string', 'max:64'],
            'repair_notes' => ['nullable', 'string'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['nullable', 'array:name,path,url'],
            'images.*.name' => ['required_with:images', 'string'],
            'images.*.path' => ['required_with:images', 'string'],
            'images.*.url' => ['required_with:images', 'url'],
        ];
    }
}
