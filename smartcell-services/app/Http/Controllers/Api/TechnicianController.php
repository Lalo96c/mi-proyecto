<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TechnicianResource;
use App\Models\Technician;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 100);
        $perPage = max(1, min($perPage, 100));

        $status = $request->query('status');

        $query = Technician::query();

        if ($status) {
            $query->where('status', $status);
        }

        return TechnicianResource::collection(
            $query->orderBy('name')->paginate($perPage)->withQueryString()
        );
    }
}
