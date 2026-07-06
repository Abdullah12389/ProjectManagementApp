<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'=>$this->faker->sentence(4),
            "status"=>$this->faker->randomElement(["Working","Fired"]),
            "role"=>$this->faker->randomElement(["worker","team_lead"]),
            "team_id"=>$this->faker->numberBetween(1,10)
        ];
    }
}
