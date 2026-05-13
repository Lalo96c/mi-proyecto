<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        // Estadísticas generales
        $totalProducts = Product::count();
        $totalClients = Client::count();
        $totalSales = Sale::count();
        $totalPurchases = Purchase::count();

        // Ventas del mes actual
        $currentMonthSales = Sale::whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');

        // Ventas del mes anterior
        $lastMonthSales = Sale::whereMonth('sale_date', now()->subMonth()->month)
            ->whereYear('sale_date', now()->subMonth()->year)
            ->sum('total_amount');

        // Compras del mes actual
        $currentMonthPurchases = Purchase::whereMonth('purchase_date', now()->month)
            ->whereYear('purchase_date', now()->year)
            ->sum('total_amount');

        // Compras del mes anterior
        $lastMonthPurchases = Purchase::whereMonth('purchase_date', now()->subMonth()->month)
            ->whereYear('purchase_date', now()->subMonth()->year)
            ->sum('total_amount');

        // Productos con stock bajo (< 10 unidades)
        $lowStockProducts = Product::where('quantity', '<', 10)
            ->where('quantity', '>', 0)
            ->count();

        // Productos sin stock
        $outOfStockProducts = Product::where('quantity', 0)->count();

        // Ventas por mes (últimos 12 meses)
        $salesByMonth = Sale::select(
                DB::raw('YEAR(sale_date) as year'),
                DB::raw('MONTH(sale_date) as month'),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->where('sale_date', '>=', now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => sprintf('%04d-%02d', $item->year, $item->month),
                    'total' => (float) $item->total,
                    'count' => (int) $item->count,
                ];
            });

        // Compras por mes (últimos 12 meses)
        $purchasesByMonth = Purchase::select(
                DB::raw('YEAR(purchase_date) as year'),
                DB::raw('MONTH(purchase_date) as month'),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->where('purchase_date', '>=', now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => sprintf('%04d-%02d', $item->year, $item->month),
                    'total' => (float) $item->total,
                    'count' => (int) $item->count,
                ];
            });

        // Top 5 productos más vendidos
        $topProducts = DB::table('sale_details')
            ->join('products', 'sale_details.product_id', '=', 'products.id')
            ->select(
                'products.name',
                'products.code',
                DB::raw('SUM(sale_details.quantity) as total_quantity'),
                DB::raw('SUM(sale_details.line_total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.code')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'code' => $item->code,
                    'quantity' => (int) $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        // Ventas por estado de producto
        $productsByStatus = Product::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'general' => [
                'total_products' => $totalProducts,
                'total_clients' => $totalClients,
                'total_sales' => $totalSales,
                'current_month_sales' => (float) $currentMonthSales,
                'last_month_sales' => (float) $lastMonthSales,
                'sales_growth' => $lastMonthSales > 0
                    ? round((($currentMonthSales - $lastMonthSales) / $lastMonthSales) * 100, 2)
                    : ($currentMonthSales > 0 ? 100 : 0),
                'total_purchases' => $totalPurchases,
                'current_month_purchases' => (float) $currentMonthPurchases,
                'last_month_purchases' => (float) $lastMonthPurchases,
                'purchases_growth' => $lastMonthPurchases > 0
                    ? round((($currentMonthPurchases - $lastMonthPurchases) / $lastMonthPurchases) * 100, 2)
                    : ($currentMonthPurchases > 0 ? 100 : 0),
            ],
            'inventory' => [
                'low_stock' => $lowStockProducts,
                'out_of_stock' => $outOfStockProducts,
                'by_status' => $productsByStatus,
            ],
            'charts' => [
                'sales_by_month' => $salesByMonth,
                'purchases_by_month' => $purchasesByMonth,
                'top_products' => $topProducts,
            ],
        ]);
    }
}