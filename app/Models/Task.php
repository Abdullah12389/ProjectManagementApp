<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable=[
        'title',
        'description',
        'due_date',
        'project_id',
        'status'
    ];
    public function user(){
        return $this->belongsToMany(User::class,'user_task');
    }
    public function project(){
        return $this->belongsTo(Project::class);
    }
    public function comment(){
        return $this->hasMany(Comment::class);
    }
}
