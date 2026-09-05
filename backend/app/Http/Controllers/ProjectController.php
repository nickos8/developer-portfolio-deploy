<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the published projects. Public.
     */
    public function index()
    {
        $projects = Project::query()
            ->where('is_published', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($projects);
    }

    /**
     * Display every project regardless of publish state, for the
     * authenticated admin dashboard.
     */
    public function adminIndex()
    {
        $projects = Project::query()
            ->orderBy('display_order')
            ->get();

        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        $validated['slug'] = $this->uniqueSlug(Str::slug($validated['title']));

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource. Public, but a project that is not
     * published is treated as not found.
     */
    public function show(Project $project)
    {
        if (! $project->is_published) {
            abort(404);
        }

        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return response()->json($project->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $project->delete();

        return response()->json(null, 204);
    }

    /**
     * Upload or replace the cover image for a project.
     */
    public function uploadImage(Request $request, Project $project)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $path = $request->file('image')->store('projects', 'public');

        $project->update(['image_path' => $path]);

        return response()->json($project->fresh());
    }

    /**
     * Generate a slug guaranteed to be unique among existing projects,
     * appending -2, -3, and so on when the base slug is already taken.
     */
    private function uniqueSlug(string $baseSlug): string
    {
        $slug = $baseSlug;
        $counter = 2;

        while (Project::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
