<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name"=>$this->faker->sentence(4),
            "estimated_duration"=>$this->faker->randomDigitNotZero(),
            "deadline"=>$this->faker->dateTimeBetween('now','+1 month'),
            "process_model"=>$this->faker->randomElement(["scrum","agile","spiral"]),
            "status"=>$this->faker->randomElement(["Done","InProgress"])
        ];
    }
}
