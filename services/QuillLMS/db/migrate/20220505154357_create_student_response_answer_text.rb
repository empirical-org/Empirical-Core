# frozen_string_literal: true

class CreateStudentResponseAnswerText < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_answer_texts do |t|
      # While it might be slightly misleading to call a jsonb column
      # "text", it allows us to align with all the other normalized text
      # tables that we're building for student_responses
      # The reason that this is a jsonb column instead of a text one is
      # that Lessons abuses the unstructured nature of
      # concept_results.metadata to occasionally stash arrays in them, and
      # we want to support that behavior with no special handling code
      t.jsonb :text, null: false, unique: true

      t.datetime :created_at, null: false
    end
  end
end
