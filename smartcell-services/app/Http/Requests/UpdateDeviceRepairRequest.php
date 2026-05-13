<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRepairRequest extends FormRequest
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
        $id = $this->route('device_repair') ?? $this->route('id');

        return [
            'repair_code' => ['sometimes', 'string', 'max:64', 'unique:device_repairs,repair_code,' . $id],
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'technician_id' => ['nullable', 'integer', 'exists:technicians,id'],
            'device_description' => ['sometimes', 'string', 'max:255'],
            'fault_description' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:recibido,en_reparacion,reparado,entregado'],
            'total_amount' => ['sometimes', 'numeric', 'min:0'],
            'receipt_number' => ['nullable', 'string', 'max:64'],
            'repair_notes' => ['nullable', 'string'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['nullable', 'array:name,path,url'],
            'images.*.name' => ['required_with:images', 'string'],
            'images.*.path' => ['required_with:images', 'string'],
            'images.*.url' => ['required_with:images', 'url'],
            'delivered_at' => ['nullable', 'date'],
        ];
    }
}
