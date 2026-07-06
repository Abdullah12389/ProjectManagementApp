<?php

namespace App\Http\Controllers;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Pest\Plugins\Only;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projectId=$request->query('projectid');
        $project=Project::findOrFail($projectId);
        $tasks=$project->task()->user()->where("users.id",Auth::user()->id)->get();
        return Inertia::render('KanbanBoard/page',[
            'project_id'=>$projectId,
            'tasks'=>$tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated=$request->validate([
            'name'=>'string|required',
            'description'=>'string|required',
            'deadline'=>'date|required',
            'assigned_to'=>'required|array',
            'project_id'=>'required'
        ]);
        $task=Task::create([
            'title'=>$validated['name'],
            'description'=>$validated['description'],
            'due_date'=>$validated['deadline'],
            'project_id'=>$validated['project_id'],
            'status'=>'todo'
        ]);
        if(!empty($validated['assigned_to'])){
            $task->user()->sync($validated['assigned_to']);
        }
        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userid=Auth::user()->id;
        $task=Task::findOrFail($id);
        $comments=$task->comment()->with(['user'=>function($query) use ($userid){
            $query->select('id')
                ->selectRaw("Case when id=? Then 'You' else name End as name",[$userid]);
        }])->get();
        return Inertia::render("Comments/page",[
            "comments"=>$comments,
            "task_id"=>$task->id,
            "description"=>$task->description,
            "name"=>$task->title,
            "user_id"=>$userid
        ]);
    }
        public function statusupdate(string $id,string $status){
            $task=Task::findOrFail($id);
            $task->status=$status;
            $task->save();
        }
        

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request,string $id)
    // {
    //     $ValidatedData=$request->only([
    //         'title',
    //         'description',
    //         'due_date'
    //     ]);
    //     $item=Task::where('id',$id);
    //     $item->update($ValidatedData);
    //     if($request->employees){
    //         $item-()->syncChanges($request->employees);
    //     }
    //     return   
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task=Task::findOrFail($id);
        $task->delete();
        return redirect()->back();
    }
}
