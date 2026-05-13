<?php

namespace App\Http\Controllers;

use App\Models\DeviceRepair;
use Illuminate\Http\Request;

class RepairReceiptController extends Controller
{
    /**
     * Mostrar comprobante de reparación
     * 
     * @param int $id ID de la reparación
     * @return \Illuminate\View\View
     */
    public function show($id)
    {
        $repair = DeviceRepair::with(['client', 'technician'])->findOrFail($id);
        
        return view('repair-receipt', [
            'repair' => $repair,
        ]);
    }
}
