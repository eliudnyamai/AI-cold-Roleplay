<?php

use App\Http\Controllers\AssistantsController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PlayController;
use App\Http\Controllers\ProfileController;
use App\Models\Assistant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $AI_sellers = Assistant::all();
    return inertia("Assistants/Index", [
        'AI_sellers' => $AI_sellers,
        'success' => session('success')
    ]);
});

Route::get('/dashboard', function () {
    $AI_sellers = Assistant::all();
    return inertia("Assistants/Index", [
        'AI_sellers' => $AI_sellers,
        'success' => session('success')
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/test', [ChatController::class, 'test']);
Route::get('/testView', [ChatController::class, 'view']);
Route::post('/audio', [ChatController::class, 'audio']);


Route::middleware('auth')->group(function () {
    Route::post('/win', [PlayController::class, 'win']);
    Route::post('/fail', [PlayController::class, 'fail']);
    Route::post('/play', [PlayController::class, 'play']);
    Route::get('/quit', [PlayController::class, 'quitPlay']);
    Route::get('/continue', [PlayController::class, 'continuePlay']);
    Route::get('/clearPlays', [PlayController::class, 'deleteAllUserPlays']);
    Route::resource('assistants', AssistantsController::class);
    Route::resource('plays', PlayController::class);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
