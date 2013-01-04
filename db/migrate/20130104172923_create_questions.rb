class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :answer_keywords
      t.text :question_text
      t.belongs_to :lecture_chapter
      t.timestamps
    end

    add_index :questions, :lecture_chapter_id

  end
end
