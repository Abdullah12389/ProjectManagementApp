<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspaceRequest;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user=Auth::user();
        $workspaces=$user->workspace()->select('workspaces.id','workspaces.name','workspaces.owner_id')->with(['owner'=>function($query) use ($user) {
            $query->select('id')
                  ->selectRaw("Case when id=? Then 'You' else name End as name",[$user->id]);
        }])->withCount(['project','user'])->get();
        // $userName=User::findOrFail($workspaces->owner_id);
        return Inertia::render('Workspace/page',[
            'workspaces'=>$workspaces
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkspaceRequest $request)
    {
        $workspace=Workspace::create([
            'name'=>$request->name,
            'code'=>$request->code,
            'owner_id'=>Auth::id()
        ]);
        $workspace->user()->attach(Auth::id());
        return redirect()->route('workspace.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $workspace=Workspace::with('project')->findOrFail($id);
        if($workspace->user()->where('user_id',auth()->id())->exists()){
            $projects=$workspace->project;
            foreach($projects as $project){
                $project->progress=$project->getprogress();
            }
            return Inertia::render('Projects/page',[
                'workspace'=>[
                    'id'=>$workspace->id,
                    'name'=>$workspace->name
                ],
                'projects'=>$projects,
                'isowner'=>$workspace->owner_id===Auth::user()->id
            ]);
        }
        abort(403);
    }

    public function join(Request $request){
        $validated=$request->validate([
            'code'=>"string|required"
        ]);
        $workspace=Workspace::where('code',$validated['code'])->first();
        if(!$workspace){ 
            return back()->withErrors(['code'=>'InvalidWorkSpaceCode']);
        }
        if($workspace->user()->where('user_id',auth()->id())->exists()){
            return back()->withErrors(['code'=>'You are already a memeber']);
        }
        $workspace->user()->attach(auth()->id());
        return redirect()->route('workspace.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreWorkspaceRequest $request, string $id)
    {
        $workspace=Workspace::findOrFail($id);
        if($workspace->owner_id===Auth::id()){
            $workspace->update([
            'name'=>$request->name,
            "code"=>$request->code
            ]);
            return redirect()->back();
        }
        abort(503);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $curr_user=Auth::user();
        $workspace=Workspace::findOrFail($id);
        if($curr_user->id===$workspace->owner_id){
            $workspace->delete();
            return redirect()->back();
        }
        abort(403);

    }
}
