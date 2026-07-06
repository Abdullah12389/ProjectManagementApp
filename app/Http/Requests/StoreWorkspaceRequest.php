<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name"=>'required|min:3|max:50',
            "code"=>"required|min:8|max:255|unique:workspaces,code"
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'A workspace needs a name!',
            'name.min'      => 'Try a slightly longer name.',
            'name.max'      => 'Keep it less than 50',
            'code.min'      => 'Code must be atleast 8 Characters',
            'code.max'      => 'Insane Security our servers crashed',
            'code.unique'   => 'We told this user to choose strong password'
        ];
    }
}
