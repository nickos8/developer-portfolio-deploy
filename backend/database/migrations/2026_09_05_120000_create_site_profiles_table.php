<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This table only ever holds one row -- the site owner's public
     * profile content (name, bio, skills, contact details). Keeping it
     * as a real table rather than a config file lets the admin edit it
     * from the dashboard without a redeploy.
     */
    public function up(): void
    {
        Schema::create('site_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('tagline', 500);
            $table->string('location')->nullable();
            $table->string('email')->nullable();
            $table->string('resume_url')->nullable();
            $table->json('about');
            $table->json('skills');
            $table->json('social_links');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_profiles');
    }
};
