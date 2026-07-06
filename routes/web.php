<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

Route::middleware('auth')->group(function(){
    Route::resource('workspace',WorkspaceController::class);
    Route::resource('project',ProjectController::class);
    Route::resource('task',TaskController::class);
    Route::resource('comment',CommentController::class);
    Route::post('workspace/join',[WorkspaceController::class,'join'])->name('workspace.join');
    Route::post('/logout',[AuthenticatedSessionController::class,'destroy'])->name('logout');
    Route::patch('/task/{id}/status/{status}', [TaskController::class, 'statusupdate'])
    ->name('task.statusupdate');
});

Route::get('/',function (){
    return Inertia::render("SignUp/page");
});

Route::post('/register',[AuthController::class,'register'])->name('register.store');

Route::post('/login',[AuthController::class,'login'])->name('login.store');

require __DIR__.'/settings.php';
