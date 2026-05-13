<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $repair_code
 * @property int $client_id
 * @property int|null $technician_id
 * @property string $device_description
 * @property string $fault_description
 * @property string $status
 * @property string $total_amount
 * @property string|null $receipt_number
 * @property string|null $repair_notes
 * @property array|null $images
 * @property string|null $delivered_at
 */
class DeviceRepair extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'device_repairs';

    protected $fillable = [
        'repair_code',
        'client_id',
        'technician_id',
        'device_description',
        'fault_description',
        'status',
        'total_amount',
        'receipt_number',
        'repair_notes',
        'images',
        'delivered_at',
    ];

    protected $filterable = [
        'repair_code',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'delivered_at' => 'datetime',
            'images' => 'array',
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
     * @return BelongsTo<Technician, $this>
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    #[\Illuminate\Database\Eloquent\Attributes\Scope]
    public function filterByDateRange(Builder $query, ?string $from, ?string $to): void
    {
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
    }

    /**
     * Scope para filtros genéricos
     */
    #[\Illuminate\Database\Eloquent\Attributes\Scope]
    public function filter(Builder $query, array $filters): void
    {
        collect($filters)
            ->filter()
            ->each(fn ($value, $key) => match (true) {
                in_array($key, $this->filterable) && $value => $query->where($key, 'LIKE', "%{$value}%"),
                $key === 'status' && $value => $query->where('status', '=', $value),
                default => null,
            });
    }
}
