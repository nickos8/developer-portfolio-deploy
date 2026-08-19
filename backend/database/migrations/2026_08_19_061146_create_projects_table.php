<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->string('short_description', 300);
    $table->text('description');
    $table->json('tech_stack');
    $table->string('github_url')->nullable();
    $table->string('live_url')->nullable();
    $table->string('image_path')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->boolean('is_published')->default(false);
    $table->unsignedInteger('display_order')->default(0);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
