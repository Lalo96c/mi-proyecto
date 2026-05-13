<?php

namespace App\Models;

use Database\Factories\SaleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string $sale_code
 * @property string $sale_date
 * @property int $client_id
 * @property string $total_amount
 */
class Sale extends Model
{
    /** @use HasFactory<SaleFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sale_code',
        'sale_date',
        'client_id',
        'total_amount',
    ];

    protected $filterable = [
        'sale_code',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sale_date' => 'date',
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * @return HasMany<SaleDetail, $this>
     */
    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
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
            $query->whereDate('sale_date', '>=', $dateFrom);
        }

        if (filled($dateTo)) {
            $query->whereDate('sale_date', '<=', $dateTo);
        }
    }

    #[Scope]
    protected function filterByClient(Builder $query, ?int $clientId): void
    {
        if (filled($clientId)) {
            $query->where('client_id', $clientId);
        }
    }
}
