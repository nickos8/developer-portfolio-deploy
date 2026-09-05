<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['sometimes', 'required', 'string', 'max:255'],
            'tagline' => ['sometimes', 'required', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            // Not the "url" rule -- this is commonly a same-origin path
            // like /resume.pdf, which "url" would reject.
            'resume_url' => ['nullable', 'string', 'max:500'],

            'about' => ['sometimes', 'required', 'array', 'min:1'],
            'about.*' => ['required', 'string', 'max:2000'],

            'skills' => ['sometimes', 'required', 'array', 'min:1'],
            'skills.*.category' => ['required', 'string', 'max:100'],
            'skills.*.items' => ['required', 'array', 'min:1'],
            'skills.*.items.*' => ['required', 'string', 'max:100'],

            'social_links' => ['sometimes', 'array'],
            'social_links.*.label' => ['required', 'string', 'max:100'],
            'social_links.*.url' => ['required', 'url', 'max:500'],
        ];
    }
}
