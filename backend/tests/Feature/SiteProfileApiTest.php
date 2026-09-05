<?php

namespace Tests\Feature;

use App\Models\SiteProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_guest_cannot_upload_an_avatar(): void
    {
        Storage::fake('public');

        $this->postJson('/api/site-profile/avatar', [
            'avatar' => UploadedFile::fake()->image('me.jpg'),
        ])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_upload_an_avatar(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create());

        $response = $this->post(
            '/api/site-profile/avatar',
            ['avatar' => UploadedFile::fake()->image('me.jpg')],
            ['Accept' => 'application/json'],
        );

        $response->assertOk();

        $path = $response->json('avatar_path');

        $this->assertNotEmpty($path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_uploading_a_new_avatar_removes_the_previous_one(): void
    {
        Storage::fake('public');

        $profile = SiteProfile::current();
        $profile->update(['avatar_path' => 'profile/old.jpg']);
        Storage::disk('public')->put('profile/old.jpg', 'fake-contents');

        $this->actingAs(User::factory()->create());

        $this->post(
            '/api/site-profile/avatar',
            ['avatar' => UploadedFile::fake()->image('new.jpg')],
            ['Accept' => 'application/json'],
        )->assertOk();

        Storage::disk('public')->assertMissing('profile/old.jpg');
    }

    public function test_avatar_upload_requires_a_valid_image_file(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create());

        $this->post(
            '/api/site-profile/avatar',
            ['avatar' => UploadedFile::fake()->create('notes.txt', 10)],
            ['Accept' => 'application/json'],
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['avatar']);
    }
}
