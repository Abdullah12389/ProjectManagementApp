<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            "sidebarData"=>function(){
                if(Auth::check()){
                    $user=Auth::user();
                    $workspaces=$user->workspace()->with('project:id,name,workspace_id')->get(['workspaces.id','workspaces.name'])->makeHidden('pivot');
                    return [
                        'workspace'=>$workspaces->toArray()
                    ];
                }
                return[
                    'workspace'=>[]
                ];
            }
        ]);
    }
}
