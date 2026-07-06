<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Project;

class Workspace extends Model
{
    protected $fillable=[
        'name',
        'code',
        'owner_id'
    ];
    public function project(){
        return $this->hasMany(Project::class);
    }
    public function user(){
        return $this->belongsToMany(User::class);
    }
    public function owner(){
        return $this->belongsTo(User::class,"owner_id");
    }
}
