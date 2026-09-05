<?php

namespace Tests\Feature;

use App\Models\SiteProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_show_returns_default_content_on_a_fresh_deploy(): void
    {
        $this->assertDatabaseCount('site_profiles', 0);

        $response = $this->getJson('/api/site-profile')
            ->assertOk();

        $response
            ->assertJsonPath('name', 'Your Name')
            ->assertJsonPath('role', 'Junior Web Developer')
            ->assertJsonCount(2, 'about')
            ->assertJsonCount(3, 'skills');

        $this->assertDatabaseCount('site_profiles', 1);
    }

    public function test_public_show_returns_the_same_row_on_repeated_calls(): void
    {
        $first = $this->getJson('/api/site-profile')->json('id');
        $second = $this->getJson('/api/site-profile')->json('id');

        $this->assertSame($first, $second);
        $this->assertDatabaseCount('site_profiles', 1);
    }

    public function test_guest_cannot_update_the_site_profile(): void
    {
        $this->putJson('/api/site-profile', ['name' => 'New Name'])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_update_the_site_profile(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->putJson('/api/site-profile', [
            'name' => 'Niko Sarmiento',
            'role' => 'Full-Stack Developer',
            'tagline' => 'I build things for the web.',
            'location' => 'Cebu, Philippines',
            'email' => 'niko@example.com',
            'resume_url' => '/resume.pdf',
            'about' => ['First paragraph.', 'Second paragraph.'],
            'skills' => [
                ['category' => 'Languages', 'items' => ['PHP', 'JavaScript']],
            ],
            'social_links' => [
                ['label' => 'GitHub', 'url' => 'https://github.com/nickos8'],
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('name', 'Niko Sarmiento')
            ->assertJsonPath('skills.0.category', 'Languages');

        $this->assertDatabaseHas('site_profiles', ['name' => 'Niko Sarmiento']);
    }

    public function test_partial_update_leaves_other_fields_untouched(): void
    {
        $profile = SiteProfile::current();

        $this->actingAs(User::factory()->create());

        $this->putJson('/api/site-profile', ['name' => 'Just The Name'])
            ->assertOk()
            ->assertJsonPath('name', 'Just The Name')
            ->assertJsonPath('role', $profile->role);
    }

    public function test_invalid_profile_data_is_rejected(): void
    {
        $this->actingAs(User::factory()->create());

        $this->putJson('/api/site-profile', [
            'name' => '',
            'email' => 'not-an-email',
            'about' => [],
            'skills' => [
                ['category' => '', 'items' => []],
            ],
            'social_links' => [
                ['label' => 'GitHub', 'url' => 'not-a-url'],
            ],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'about',
                'skills.0.category',
                'skills.0.items',
                'social_links.0.url',
            ]);
    }
}
