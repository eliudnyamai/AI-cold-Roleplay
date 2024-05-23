<?php

use App\Http\Controllers\PlayController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/play', [PlayController::class, 'play']);
Route::post('/win', [PlayController::class, 'win']);
Route::post('/fail', [PlayController::class, 'fail']);