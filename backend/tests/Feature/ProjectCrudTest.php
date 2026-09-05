<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_show_returns_a_published_project(): void
    {
        $project = Project::create($this->projectData(['is_published' => true]));

        $this->getJson("/api/projects/{$project->id}")
            ->assertOk()
            ->assertJsonPath('id', $project->id)
            ->assertJsonPath('slug', $project->slug);
    }

    public function test_public_show_hides_an_unpublished_project(): void
    {
        $project = Project::create($this->projectData(['is_published' => false]));

        $this->getJson("/api/projects/{$project->id}")
            ->assertNotFound();
    }

    public function test_guest_cannot_list_admin_projects(): void
    {
        $this->getJson('/api/admin/projects')
            ->assertUnauthorized();
    }

    public function test_authenticated_user_sees_every_project_in_admin_list(): void
    {
        Project::create($this->projectData(['is_published' => true, 'display_order' => 2]));
        Project::create($this->projectData(['is_published' => false, 'display_order' => 1]));

        $this->actingAs(User::factory()->create());

        $response = $this->getJson('/api/admin/projects')
            ->assertOk();

        $this->assertCount(2, $response->json());
    }

    public function test_guest_cannot_update_a_project(): void
    {
        $project = Project::create($this->projectData());

        $this->putJson("/api/projects/{$project->id}", ['title' => 'New Title'])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_update_a_project(): void
    {
        $project = Project::create($this->projectData());

        $this->actingAs(User::factory()->create());

        $this->putJson("/api/projects/{$project->id}", [
            'title' => 'Updated Title',
            'is_featured' => true,
        ])
            ->assertOk()
            ->assertJsonPath('title', 'Updated Title')
            ->assertJsonPath('is_featured', true)
            ->assertJsonPath('slug', $project->slug);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_invalid_update_data_is_rejected(): void
    {
        $project = Project::create($this->projectData());

        $this->actingAs(User::factory()->create());

        $this->putJson("/api/projects/{$project->id}", [
            'title' => '',
            'github_url' => 'not-a-valid-url',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'github_url']);
    }

    public function test_guest_cannot_delete_a_project(): void
    {
        $project = Project::create($this->projectData());

        $this->deleteJson("/api/projects/{$project->id}")
            ->assertUnauthorized();

        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    public function test_authenticated_user_can_delete_a_project(): void
    {
        $project = Project::create($this->projectData());

        $this->actingAs(User::factory()->create());

        $this->deleteJson("/api/projects/{$project->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_deleting_a_project_removes_its_stored_image(): void
    {
        Storage::fake('public');

        $project = Project::create($this->projectData());
        $project->update(['image_path' => 'projects/cover.jpg']);
        Storage::disk('public')->put('projects/cover.jpg', 'fake-contents');

        $this->actingAs(User::factory()->create());

        $this->deleteJson("/api/projects/{$project->id}")
            ->assertNoContent();

        Storage::disk('public')->assertMissing('projects/cover.jpg');
    }

    public function test_guest_cannot_upload_a_project_image(): void
    {
        Storage::fake('public');

        $project = Project::create($this->projectData());

        $this->postJson("/api/projects/{$project->id}/image", [
            'image' => UploadedFile::fake()->image('cover.jpg'),
        ])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_upload_a_project_image(): void
    {
        Storage::fake('public');

        $project = Project::create($this->projectData());

        $this->actingAs(User::factory()->create());

        $response = $this->post(
            "/api/projects/{$project->id}/image",
            ['image' => UploadedFile::fake()->image('cover.jpg')],
            ['Accept' => 'application/json'],
        );

        $response->assertOk();

        $path = $response->json('image_path');

        $this->assertNotEmpty($path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_uploading_a_new_image_removes_the_previous_one(): void
    {
        Storage::fake('public');

        $project = Project::create($this->projectData());
        $project->update(['image_path' => 'projects/old.jpg']);
        Storage::disk('public')->put('projects/old.jpg', 'fake-contents');

        $this->actingAs(User::factory()->create());

        $this->post(
            "/api/projects/{$project->id}/image",
            ['image' => UploadedFile::fake()->image('new.jpg')],
            ['Accept' => 'application/json'],
        )->assertOk();

        Storage::disk('public')->assertMissing('projects/old.jpg');
    }

    public function test_image_upload_requires_a_valid_image_file(): void
    {
        Storage::fake('public');

        $project = Project::create($this->projectData());

        $this->actingAs(User::factory()->create());

        $this->post(
            "/api/projects/{$project->id}/image",
            ['image' => UploadedFile::fake()->create('notes.txt', 10)],
            ['Accept' => 'application/json'],
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    private function projectData(array $overrides = []): array
    {
        static $counter = 0;
        $counter++;

        return array_merge([
            'title' => "Portfolio System {$counter}",
            'slug' => "portfolio-system-{$counter}",
            'short_description' => 'A developer portfolio management system.',
            'description' => 'A full-stack portfolio built with Laravel and React.',
            'tech_stack' => ['Laravel', 'React'],
            'github_url' => 'https://github.com/nickos8/developer-portfolio',
            'live_url' => null,
            'is_featured' => true,
            'is_published' => true,
            'display_order' => 1,
        ], $overrides);
    }
}
