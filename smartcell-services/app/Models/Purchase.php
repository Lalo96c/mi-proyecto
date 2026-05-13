<?php

namespace App\Models;

use Database\Factories\PurchaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string $purchase_code
 * @property string $purchase_date
 * @property string $supplier_name
 * @property string $total_amount
 */
class Purchase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'purchase_code',
        'purchase_date',
        'supplier_name',
        'total_amount',
    ];

    protected $filterable = [
        'purchase_code',
        'supplier_name',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<PurchaseDetail, $this>
     */
    public function purchaseDetails(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    #[Scope]
    protected function filter(Builder $query, array $filters): void
    {
        foreach ($filters as $field => $value) {
            if (in_array($field, $this->filterable) && filled($value)) {
                $query->where($field, 'LIKE', "%{$value}%");
            }
        }
    }

    #[Scope]
    protected function filterByDateRange(Builder $query, ?string $dateFrom, ?string $dateTo): void
    {
        if (filled($dateFrom)) {
            $query->whereDate('purchase_date', '>=', $dateFrom);
        }

        if (filled($dateTo)) {
            $query->whereDate('purchase_date', '<=', $dateTo);
        }
    }
}
