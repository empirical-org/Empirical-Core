class CreateActivitySurveyResponses < ActiveRecord::Migration[5.1]
  def change
    create_table :activity_survey_responses do |t|
      t.references :activity_session, index: true, foreign_key: true
      t.integer :emoji_selection, null: false
      t.string :multiple_choice_selections, array: true, null: false
      t.string :survey_question, null: false

      t.timestamps
    end
  end
end
