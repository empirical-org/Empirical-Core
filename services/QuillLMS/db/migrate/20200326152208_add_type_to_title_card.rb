class AddQuestionTypeToQuestions < ActiveRecord::Migration
  def up
    add_column :questions, :question_type, :string
    add_index :questions, :question_type
    TitleCard.update_all(question_type: TitleCard::TYPES::TYPE_CONNECT)
    change_column_null :title_cards, :title_card_type, false
  end
  def down
    remove_column :title_cards, :title_card_type
  end
end
