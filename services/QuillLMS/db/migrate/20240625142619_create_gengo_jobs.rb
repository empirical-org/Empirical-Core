# frozen_string_literal: true

class CreateGengoJobs < ActiveRecord::Migration[7.0]
  def change
    create_table :gengo_jobs do |t|
      t.integer :english_text_id, null: false
      t.integer :translated_text_id
      t.string :translation_job_id, null: false
      t.string :locale, null: false

      t.timestamps
    end
  end
end
