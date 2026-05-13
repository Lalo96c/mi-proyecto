<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\ReniecService;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $search = $request->query('search');

        $filters = [
            'dni' => $request->query('dni'),
            'first_name' => $request->query('first_name'),
            'last_name' => $request->query('last_name'),
        ];

        $query = Client::query();

        // Si hay búsqueda, usarla con OR en los 3 campos
        if ($search) {
            $query->search($search);
        } else {
            // Si no, usar los filtros individuales con AND
            $query->filter($filters);
        }

        return ClientResource::collection(
            $query->orderByDesc('id')->paginate($perPage)->withQueryString()
        );
    }
    public function show(Client $client)
    {
        return new ClientResource($client);
    }
    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return (new ClientResource($client))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return new ClientResource($client->fresh());
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->noContent();
    }

    public function queryByDni(Request $request)
    {
        $dni = $request->query('dni');

        if (!$dni) {
            return response()->json([
                'message' => 'DNI es requerido',
            ], 422);
        }

        try {
            $reniec = new ReniecService();
            $data = $reniec->queryByDni($dni);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
