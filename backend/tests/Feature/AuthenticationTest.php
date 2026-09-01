<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_authenticated_user_endpoint(): void
    {
        $this->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_user_can_login_and_access_authenticated_user_endpoint(): void
    {
        $user = User::factory()->create([
            'password' => 'password',
        ]);

        $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);
    }

    public function test_incorrect_credentials_are_rejected(): void
    {
        $user = User::factory()->create([
            'password' => 'correct-password',
        ]);

        $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create([
            'password' => 'password',
        ]);

        $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk();

        $this->postJson('/logout')
            ->assertNoContent();

        $this->getJson('/api/user')
            ->assertUnauthorized();
    }
}
