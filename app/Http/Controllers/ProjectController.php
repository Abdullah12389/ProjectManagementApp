<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $workspaceid=$request->query('workspace_id');
        $workspace=Workspace::findOrFail($workspaceid);
        if($workspace->user()->where('user_id',auth()->id())->exists()){
            $projects=$workspace->project()->get();
            return Inertia::render('Projects/page',[
                'workspace'=>[
                    'id'=>$workspace->id,
                    'name'=>$workspace->name
                ],
                'projects'=>$projects,
                'isowner'=>$workspace->owner_id===Auth::user()->id,
            ]);
        }
        abort(403);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $workspace=Workspace::findOrFail($request->workspace_id);
        if(Auth::user()->id == $workspace->owner_id){
            $projectData=$request->validate([
                'name'=>'string|max:255|required',
                'deadline'=>'required',
                'process_model'=>'required',
                'workspace_id'=>'numeric'
            ]);
            $project=Project::create($projectData);
            return redirect()->route('workspace.show',$workspace->id);
        }
        abort(403);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userId=auth()->id();
        $project=Project::findOrFail($id);
        $tasks=Task::where('project_id',$id)->whereHas('user',function ($q) use ($userId){
            $q->where('users.id',$userId);
        })->with('user')->get();
        $users=$project->workspace->user()->select('users.id','users.name')->get()->makeHidden('pivot');
        return Inertia::render('KanbanBoard/page',[
            'project'=>[
                "id"=>$project->id,
                "name"=>$project->name
            ],
            'tasks'=>$tasks,
            'users'=>$users
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task=Project::where('id',$id);
        $task->update($request->all());
        return response($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task=Project::findOrFail($id);
        $task->delete();
        return redirect()->back();
    }
}
