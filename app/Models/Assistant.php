<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assistant extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'openAI_id',
        'seller_desc',
        'image_url',
        'gender'
    ];
    public function plays()
    {
        return $this->hasMany(Play::class, 'AI_seller_id');
    }

}
