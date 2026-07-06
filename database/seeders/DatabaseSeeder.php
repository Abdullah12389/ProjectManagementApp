<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Task;
use App\Models\Employee;
use App\Models\Team;
use App\Models\Project;
use App\Models\Comment;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Factories\TaskFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        Company::factory()->count(2)->create();
        Team::factory()->count(10)->create();
        Employee::factory()->count(100)->create();
        Project::factory()->count(5)->create();
        Task::factory()->count(1000)->create();
    }
}
