<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content'=>$this->faker->sentence(5),
            'employee_id'=>$this->faker->numberBetween(1,100),
            'task_id'=>$this->faker->numberBetween(1,1000),
        ];
    }
}
