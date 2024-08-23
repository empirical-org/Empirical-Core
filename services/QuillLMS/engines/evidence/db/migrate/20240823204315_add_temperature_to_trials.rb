# frozen_string_literal: true

class AddTemperatureToTrials < ActiveRecord::Migration[6.1]
  def up
    add_column :evidence_research_gen_ai_trials, :temperature, :float

    Evidence::Research::GenAI::Trial.update_all(temperature: 1.0)

    change_column_null :evidence_research_gen_ai_trials, :temperature, false
  end

  def down
    remove_column :evidence_research_gen_ai_trials, :temperature
  end
end
