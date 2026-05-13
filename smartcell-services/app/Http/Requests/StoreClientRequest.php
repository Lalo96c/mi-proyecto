<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'dni' => ['required', 'string', 'max:20', Rule::unique('clients', 'dni')->whereNull('deleted_at')],
            'first_name' => ['required', 'string', 'max:100', 'regex:/^[a-záéíóúñ\s]+$/i'],
            'last_name' => ['required', 'string', 'max:100', 'regex:/^[a-záéíóúñ\s]+$/i'],
            'phone' => ['nullable', 'string', 'max:32', 'regex:/^[0-9\s\-\+\(\)]+$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.regex' => 'El nombre no puede contener números',
            'last_name.regex' => 'Los apellidos no pueden contener números',
            'phone.regex' => 'El teléfono solo puede contener números, espacios, guiones, + o paréntesis',
            'dni.unique' => 'El DNI ya está registrado',
        ];
    }
}
