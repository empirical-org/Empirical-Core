class CreatePromptHealths < ActiveRecord::Migration
  def change
    create_table :prompt_healths do |t|
      t.string      :text
      t.string      :url
      t.string      :flag
      t.integer     :incorrect_sequences
      t.integer     :focus_points
      t.float       :percent_common_unmatched
      t.float       :percent_specified_algorithms
      t.float       :difficulty
      t.float       :percent_reached_optimal
      t.references  :activity_health
    end
    add_foreign_key :prompt_healths, :activity_healths, column: :activity_health_id, on_delete: :cascade
  end
end
