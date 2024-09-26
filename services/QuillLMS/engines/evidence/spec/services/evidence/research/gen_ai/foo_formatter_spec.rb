# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe FooFormatter, external_api: true do
        subject { described_class.run(data:, prompt_id:) }

        let(:prompt_id) { 1 }
        let(:data) do
          [
            ['the barrier could block fish from getting to their spawning locations.', 'Optimal_1'],
            ['it disrupts the lifecycle of the fish by preventing them from getting to the spawning location.', 'Optimal_1'],
            ['fish would be interrupted during spawning because the barrier would block the location that they spawn at.', 'Optimal_1'],
            ['fish would be interrupted during the spawning season, the surge barrier could block the air that they spawn at.', 'Optimal_1'],
            ['the spawning season for many fish could be interrupted, the barrier could block the fish from getting to their eggs.', 'Optimal_1'],
            ["it could block spawning location which wouldn't let fish lay eggs.", 'Optimal_1'],
            ['it could interrupt the spawning season for the fish in the area by blocking certain fish from getting to their spawn locations.', 'Optimal_1'],
            ['It prevents animals from getting to their spawning locations.', 'Optimal_1'],
            ['at a particular time of year fish travel to locations to lay their eggs and a surge barrier could block the fish.', 'Optimal_2'],
            ['it could affect the fish that live in the waters in New York, by separating them from laying grounds.', 'Optimal_2'],
            ['it could interrupt the spawning season of the fish by blocking places where they lay eggs.', 'Optimal_2'],
            ['the surge barrier could block fish from getting to their spawning locations to release their eggs.', 'Optimal_3'],
            ["it's an issue for the reproduction of fish, blocking areas for the fish to spawn their eggs.", 'Optimal_4'],
            ["it's an issue for the reproduction of fish, blocking area for the fish to spawn.", 'Optimal_5']
          ]
        end

        it do
          subject
        end
      end
    end
  end
end
