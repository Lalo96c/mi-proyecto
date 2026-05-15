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
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'technician_id' => ['nullable', 'integer', 'exists:technicians,id'],
            'device_type' => ['sometimes', 'string', 'max:64'],
            'device_description' => ['sometimes', 'string', 'max:255'],
            'device_lock' => ['nullable', 'string', 'max:128'],
            'fault_description' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:recibido,en_reparacion,reparado,entregado'],
            'total_amount' => ['sometimes', 'numeric', 'min:0'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'repair_notes' => ['nullable', 'string'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['nullable', 'array:name,path,url'],
            'images.*.name' => ['required_with:images', 'string'],
            'images.*.path' => ['required_with:images', 'string'],
            'images.*.url' => ['required_with:images', 'url'],
            'tools_used' => ['nullable', 'array'],
            'tools_used.*' => ['string', 'max:64'],
            'delivered_at' => ['nullable', 'date'],
        ];
    }
}
