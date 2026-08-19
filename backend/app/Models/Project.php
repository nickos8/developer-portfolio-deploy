<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
        protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'tech_stack',
        'github_url',
        'live_url',
        'image_path',
        'is_featured',
        'is_published',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer',
        ];
    }
}
