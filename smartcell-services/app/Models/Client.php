<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string $dni
 * @property string $first_name
 * @property string $last_name
 * @property string|null $phone
 */
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'dni',
        'first_name',
        'last_name',
        'phone',
    ];

    protected $filterable = [
        'dni',
        'first_name',
        'last_name',
        'phone',
    ];

    /**
     * @return HasMany<Sale, $this>
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
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
    protected function search(Builder $query, ?string $term): void
    {
        if (! filled($term)) {
            return;
        }

        $query->where(function (Builder $q) use ($term) {
            $q->where('first_name', 'LIKE', "%{$term}%")
                ->orWhere('last_name', 'LIKE', "%{$term}%")
                ->orWhere('dni', 'LIKE', "%{$term}%");
        });
    }

    // Mutadores para capitalizar nombres y apellidos (cada palabra con mayúscula)
    protected function setFirstNameAttribute(string $value): void
    {
        $this->attributes['first_name'] = ucwords(strtolower(trim($value)));
    }

    protected function setLastNameAttribute(string $value): void
    {
        $this->attributes['last_name'] = ucwords(strtolower(trim($value)));
    }
}
