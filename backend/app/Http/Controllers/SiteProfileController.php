<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSiteProfileRequest;
use App\Models\SiteProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteProfileController extends Controller
{
    /**
     * Display the site's public profile content (name, bio, skills,
     * contact details). Public, and always returns something -- a
     * brand-new deploy gets sensible default/placeholder content the
     * first time this is called.
     */
    public function show()
    {
        return response()->json(SiteProfile::current());
    }

    /**
     * Update the site's profile content.
     */
    public function update(UpdateSiteProfileRequest $request)
    {
        $profile = SiteProfile::current();
        $profile->update($request->validated());

        return response()->json($profile->fresh());
    }

    /**
     * Upload or replace the profile photo shown in the Hero section.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:4096'],
        ]);

        $profile = SiteProfile::current();

        if ($profile->avatar_path) {
            Storage::disk('public')->delete($profile->avatar_path);
        }

        $path = $request->file('avatar')->store('profile', 'public');

        $profile->update(['avatar_path' => $path]);

        return response()->json($profile->fresh());
    }
}
