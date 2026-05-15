<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TechnicianResource;
use App\Models\Technician;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class TechnicianController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $status = $request->query('status');
        $search = $request->query('search', '');
        $name = $request->query('name');
        $dni = $request->query('dni');
        $specialty = $request->query('specialty');

        $query = Technician::query();

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('dni', 'like', "%{$search}%")
                  ->orWhere('specialty', 'like', "%{$search}%");
            });
        } else {
            if ($name) {
                $query->where('name', 'like', "%{$name}%");
            }
            if ($dni) {
                $query->where('dni', 'like', "%{$dni}%");
            }
            if ($specialty) {
                $query->where('specialty', 'like', "%{$specialty}%");
            }
        }

        $paginator = $query->orderBy('name')->paginate($perPage)->withQueryString();
        return TechnicianResource::collection($paginator);
    }

    public function store(Request $request): TechnicianResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|string|max:20',
            'specialty' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:activo,inactivo',
        ]);

        $technician = Technician::create([
            'name' => $validated['name'],
            'dni' => $validated['dni'],
            'specialty' => $validated['specialty'],
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['status'] ?? 'activo',
        ]);

        return new TechnicianResource($technician);
    }

    public function show(Technician $technician): TechnicianResource
    {
        return new TechnicianResource($technician);
    }

    public function update(Request $request, Technician $technician): TechnicianResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'dni' => 'sometimes|required|string|max:20',
            'specialty' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:activo,inactivo',
        ]);

        $technician->update($validated);

        return new TechnicianResource($technician);
    }

    public function destroy(Technician $technician): JsonResponse
    {
        $technician->delete();

        return response()->json(null, 204);
    }
}
