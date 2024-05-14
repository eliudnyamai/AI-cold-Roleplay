<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Play extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'Thread_id',
        'AI_seller_id',
        'user_id',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function assistant()
    {
        return $this->belongsTo(Assistant::class, 'AI_seller_id');
    }
}
