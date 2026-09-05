<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteProfile extends Model
{
    protected $fillable = [
        'name',
        'role',
        'tagline',
        'location',
        'email',
        'resume_url',
        'about',
        'skills',
        'social_links',
    ];

    protected function casts(): array
    {
        return [
            'about' => 'array',
            'skills' => 'array',
            'social_links' => 'array',
        ];
    }

    /**
     * Sensible starter content for a brand-new deploy, before the owner
     * has edited anything from the admin dashboard.
     */
    public static function defaultAttributes(): array
    {
        return [
            'name' => 'Your Name',
            'role' => 'Junior Web Developer',
            'tagline' => 'I build full-stack web applications with Laravel, React, and PostgreSQL.',
            'location' => 'Your City, Country',
            'email' => 'you@example.com',
            'resume_url' => '/resume.pdf',
            'about' => [
                "Replace this paragraph with a short introduction: who you are, what you studied, and what kind of developer role you're looking for.",
                'A second short paragraph works well here too -- what you enjoy building, or what you learned putting this portfolio together.',
            ],
            'skills' => [
                ['category' => 'Languages', 'items' => ['PHP', 'JavaScript', 'HTML', 'CSS', 'SQL']],
                ['category' => 'Frameworks & Libraries', 'items' => ['Laravel', 'React', 'Vite']],
                ['category' => 'Tools & Platforms', 'items' => ['Git & GitHub', 'PostgreSQL', 'Supabase', 'REST APIs']],
            ],
            'social_links' => [
                ['label' => 'GitHub', 'url' => 'https://github.com/nickos8'],
            ],
        ];
    }

    /**
     * Fetch the single profile row, creating it with default content the
     * first time it's requested so the public site always has something
     * complete to show.
     */
    public static function current(): self
    {
        return static::first() ?? static::create(static::defaultAttributes());
    }
}
