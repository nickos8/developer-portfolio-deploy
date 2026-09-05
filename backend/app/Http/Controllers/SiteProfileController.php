<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSiteProfileRequest;
use App\Models\SiteProfile;

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
}
