<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth');

/*
|--------------------------------------------------------------------------
| Single-page app fallback
|--------------------------------------------------------------------------
|
| In production the React app is built into public/app (see the frontend
| Vite config and the deployment Dockerfile). Any GET request that is not
| for the API, Sanctum, auth, health check, or a real static file under
| storage/ or app/ is handed the built index.html so React Router can
| render the matching client-side page (including on a hard refresh).
|
| Locally, when the frontend runs on its own dev server (npm run dev) and
| the build has not been generated, this falls back to the default
| Laravel welcome view.
*/
Route::get('/{any?}', function () {
    $indexPath = public_path('app/index.html');

    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }

    return view('welcome');
})->where('any', '^(?!api|sanctum|login|logout|up|storage|app).*$');
