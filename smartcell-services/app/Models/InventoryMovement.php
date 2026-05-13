<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

class InventoryMovement extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const TYPE_ENTRADA = 'entrada';
    public const TYPE_SALIDA = 'salida';

    public const REASON_VENTA = 'venta';
    public const REASON_COMPRA = 'compra';
    public const REASON_USO_TECNICO = 'uso_tecnico';
    public const REASON_AJUSTE_POSITIVO = 'ajuste_positivo';
    public const REASON_AJUSTE_NEGATIVO = 'ajuste_negativo';
    public const REASON_STOCK_INICIAL = 'stock_inicial';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'reason',
    ];

    protected $filterable = [
        'type',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public static function typeValues(): array
    {
        return [
            self::TYPE_ENTRADA,
            self::TYPE_SALIDA,
        ];
    }

    public static function reasonValues(): array
    {
        return [
            self::REASON_VENTA,
            self::REASON_COMPRA,
            self::REASON_USO_TECNICO,
            self::REASON_AJUSTE_POSITIVO,
            self::REASON_AJUSTE_NEGATIVO,
            self::REASON_STOCK_INICIAL,
        ];
    }

    #[Scope]
    protected function filter(Builder $query, array $filters): void
    {
        foreach ($filters as $field => $value) {
            if (in_array($field, $this->filterable) && filled($value)) {
                $query->where($field, $value);
            }
        }
    }

    #[Scope]
    protected function filterByProduct(Builder $query, ?int $productId): void
    {
        if ($productId) {
            $query->where('product_id', $productId);
        }
    }

    #[Scope]
    protected function filterByDateRange(Builder $query, ?string $dateFrom, ?string $dateTo): void
    {
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }
    }
}