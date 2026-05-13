<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $category
 * @property int $quantity
 * @property string $sale_price
 * @property string $status
 */
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;
    use SoftDeletes;

    public const STATUS_CON_STOCK = 'CON_STOCK';

    public const STATUS_SIN_STOCK = 'SIN_STOCK';

    public const STATUS_STOCK_BAJO = 'STOCK_BAJO';

    /**
     * @return list<string>
     */
    public static function statusValues(): array
    {
        return [
            self::STATUS_CON_STOCK,
            self::STATUS_SIN_STOCK,
            self::STATUS_STOCK_BAJO,
        ];
    }

    protected $fillable = [
        'code',
        'name',
        'category',
        'quantity',
        'sale_price',
        'status',
    ];
    protected $filterable = [
        'code',
        'name',
        'category',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'sale_price' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<SaleDetail, $this>
     */
    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
    }

    /**
     * @return HasMany<PurchaseDetail, $this>
     */
    public function purchaseDetails(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    /**
     * @return HasMany<InventoryMovement, $this>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    #[Scope]
    protected function filter(Builder $query, array $filters): void
    {
        foreach ($filters as $field => $value) {
            if (filled($value)) {
                if ($field === 'status') {
                    $query->where($field, $value);
                } elseif (in_array($field, $this->filterable)) {
                    $query->where($field, 'LIKE', "%{$value}%");
                }
            }
        }
    }

    #[Scope]
    protected function search(Builder $query, ?string $term): void
    {
        if (! filled($term)) {
            return;
        }

        $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
                ->orWhere('code', 'LIKE', "%{$term}%")
                ->orWhere('category', 'LIKE', "%{$term}%");
        });
    }
}
