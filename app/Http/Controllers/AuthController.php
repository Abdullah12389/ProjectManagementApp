<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email|lowercase|max:255|unique:'.User::class,
            'password'=>['required','string','confirmed',Password::defaults()]
        ]);
        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password)
        ]);
        Auth::login($user);
        return redirect()->route('workspace.index');
    }
    public function login(Request $request){
        $credntials=$request->validate([
            'name'=>['required','string'],
            'password'=>['required','string']
        ]);
        if(Auth::attempt($credntials)){
            $request->session()->regenerate();
            return redirect()->route('workspace.index');
        }
        return back()->withErrors([
            'name'=>'credentials did not match'
        ]);
    }
}
