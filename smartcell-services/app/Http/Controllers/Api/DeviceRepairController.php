<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeviceRepairRequest;
use App\Http\Requests\UpdateDeviceRepairRequest;
use App\Http\Resources\DeviceRepairResource;
use App\Models\DeviceRepair;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceRepairController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $filters = [
            'repair_code' => $request->query('repair_code'),
            'status' => $request->query('status'),
        ];

        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');
        $clientId = (int) $request->query('client_id', 0) ?: null;
        $technicianId = (int) $request->query('technician_id', 0) ?: null;

        $query = DeviceRepair::query()
            ->with(['client', 'technician'])
            ->filter($filters)
            ->filterByDateRange($dateFrom, $dateTo);

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        if ($technicianId) {
            $query->where('technician_id', $technicianId);
        }

        $repairs = $query
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return DeviceRepairResource::collection($repairs);
    }

    public function show($id): DeviceRepairResource
    {
        $repair = DeviceRepair::findOrFail($id);
        $repair->load(['client', 'technician']);
        return new DeviceRepairResource($repair);
    }

    public function store(StoreDeviceRepairRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Procesar imágenes: mover de UUID a ID
        $processedImages = null;
        if (isset($data['images']) && is_array($data['images']) && count($data['images']) > 0) {
            // Extraer UUID del primer URL
            $firstImage = $data['images'][0];
            $uuid = null;
            
            if (isset($firstImage['path'])) {
                // Path podría ser como "/storage/repairs/{UUID}/filename.jpg"
                if (preg_match('/repairs\/([a-f0-9\-]+)\//', $firstImage['path'], $matches)) {
                    $uuid = $matches[1];
                    \Log::info('UUID extraído de path:', ['uuid' => $uuid, 'path' => $firstImage['path']]);
                }
            }
            
            $processedImages = $data['images'];
        }

        $repair = DeviceRepair::create([
            'repair_code' => $data['repair_code'],
            'client_id' => $data['client_id'],
            'technician_id' => $data['technician_id'] ?? null,
            'device_description' => $data['device_description'],
            'fault_description' => $data['fault_description'],
            'status' => $data['status'] ?? 'recibido',
            'total_amount' => $data['total_amount'] ?? 0,
            'receipt_number' => $data['receipt_number'] ?? null,
            'repair_notes' => $data['repair_notes'] ?? null,
            'images' => $processedImages,
        ]);

        // Si hay UUID y se pudo crear la reparación, mover archivos
        if (isset($uuid) && $processedImages) {
            try {
                $uuidPath = public_path("repairs/{$uuid}");
                $idPath = public_path("repairs/{$repair->id}");
                
                if (is_dir($uuidPath)) {
                    // Crear directorio destino si no existe
                    if (!is_dir($idPath)) {
                        mkdir($idPath, 0755, true);
                    }
                    
                    // Mover archivos
                    $files = scandir($uuidPath);
                    foreach ($files as $file) {
                        if ($file !== '.' && $file !== '..') {
                            rename("$uuidPath/$file", "$idPath/$file");
                        }
                    }
                    
                    // Eliminar directorio UUID
                    rmdir($uuidPath);
                    
                    // Actualizar URLs en las imágenes
                    foreach ($repair->images as &$img) {
                        $img['path'] = str_replace("/repairs/{$uuid}/", "/repairs/{$repair->id}/", $img['path']);
                        $img['url'] = str_replace("/repairs/{$uuid}/", "/repairs/{$repair->id}/", $img['url']);
                    }
                    
                    $repair->update(['images' => $repair->images]);
                    
                    \Log::info('Archivos movidos de UUID a ID', [
                        'uuid' => $uuid,
                        'id' => $repair->id,
                        'uuidPath' => $uuidPath,
                        'idPath' => $idPath,
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('Error moviendo archivos:', [
                    'error' => $e->getMessage(),
                    'uuid' => $uuid ?? 'unknown',
                    'id' => $repair->id,
                ]);
                // No fallar la creación por error al mover archivos
            }
        }

        $repair->load(['client', 'technician']);

        return (new DeviceRepairResource($repair))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateDeviceRepairRequest $request, $id): DeviceRepairResource
    {
        $repair = DeviceRepair::findOrFail($id);

        $data = $request->validated();

        $repair->update([
            'repair_code' => $data['repair_code'] ?? $repair->repair_code,
            'client_id' => $data['client_id'] ?? $repair->client_id,
            'technician_id' => $data['technician_id'] ?? $repair->technician_id,
            'device_description' => $data['device_description'] ?? $repair->device_description,
            'fault_description' => $data['fault_description'] ?? $repair->fault_description,
            'status' => $data['status'] ?? $repair->status,
            'total_amount' => $data['total_amount'] ?? $repair->total_amount,
            'receipt_number' => $data['receipt_number'] ?? $repair->receipt_number,
            'repair_notes' => $data['repair_notes'] ?? $repair->repair_notes,
            'images' => isset($data['images']) ? (is_array($data['images']) ? $data['images'] : $repair->images) : $repair->images,
            'delivered_at' => $data['delivered_at'] ?? $repair->delivered_at,
        ]);

        $repair->load(['client', 'technician']);

        return new DeviceRepairResource($repair);
    }

    public function destroy($id): JsonResponse
    {
        $repair = DeviceRepair::findOrFail($id);
        $repair->delete();

        return response()->json(null, 204);
    }
}
