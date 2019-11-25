class CreateQuestionTypes < ActiveRecord::Migration
  def change
    create_table :question_types do |t|
      t.string :name
      t.timestamps null: false
    end

    QuestionType.create :name => "connect_sentence_combining"
    QuestionType.create :name => "diagnostic_sentence_combining"
  end
end
