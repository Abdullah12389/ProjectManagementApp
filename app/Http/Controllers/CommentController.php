<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $taskId=$request->query('taskid');
        $task=Task::findOrFail($taskId);
        $this->authorize('view',$task);
        $comments=Comment::with(['task','user:id,name']);
        return Inertia::render('Comments/page',['tasks'=>$comments]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $userid=Auth::user()->id;
        $validated=$request->validate([
            'content'=>'string',
            'task_id'=>''   
        ]);
        $comment=Comment::create([
            "content"=>$validated['content'],
            "task_id"=>$validated['task_id'],
            "user_id"=>$userid
        ]);
        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tasks=Comment::where('id',$id);
        return response()->json($tasks);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task=Comment::where('id',$id);
        $task->update($request->all());
        return response($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task=Comment::where('id',$id);
        $task->delete();
    }
}
