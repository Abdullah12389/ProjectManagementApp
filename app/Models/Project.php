<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable=[
        'name',
        'deadline',
        'process_model',
        'workspace_id'
    ];
    public function workspace(){
        return $this->belongsTo(Workspace::class);
    }
    public function task(){
        return $this->hasMany(Task::class);
    }
    public function getprogress(){
        $total=$this->task()->count();
        $undone=$this->task()->where('status','done')->count();
        return $total>0 ? $undone*100/$total : 0;
    }
}
