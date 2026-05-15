<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string $name
 * @property string $dni
 * @property string $specialty
 * @property string|null $phone
 * @property string $status
 */
class Technician extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'dni',
        'specialty',
        'phone',
        'status',
    ];

    protected $filterable = [
        'name',
        'specialty',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    /**
     * @return HasMany<DeviceRepair, $this>
     */
    public function deviceRepairs(): HasMany
    {
        return $this->hasMany(DeviceRepair::class);
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
}
