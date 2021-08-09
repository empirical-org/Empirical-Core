class CreateGradedResponses < ActiveRecord::Migration[6.1]
  def change
    create_view :graded_responses, materialized: true

    add_index :graded_responses, :id, unique: true
    add_index :graded_responses, :question_uid
    add_index :graded_responses, :optimal
  end
end
