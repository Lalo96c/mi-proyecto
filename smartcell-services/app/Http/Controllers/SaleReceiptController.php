<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;

class SaleReceiptController extends Controller
{
    /**
     * Mostrar boleta de venta
     * 
     * @param int $id ID de la venta
     * @return \Illuminate\View\View
     */
    public function show($id)
    {
        $sale = Sale::with(['client', 'saleDetails.product'])->findOrFail($id);
        
        return view('sale-receipt', [
            'sale' => $sale,
        ]);
    }
}
