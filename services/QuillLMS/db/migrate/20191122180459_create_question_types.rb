class CreateQuestionTypes < ActiveRecord::Migration
  def change
    create_table :question_types do |t|
      t.string :name, unique: true
      t.timestamps null: false
    end

    QuestionType.create :id => 1, :name => "connect_sentence_combining"
    QuestionType.create :id => 2, :name => "diagnostic_sentence_combining"
  end
end
