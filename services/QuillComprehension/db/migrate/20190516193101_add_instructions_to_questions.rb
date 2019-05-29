class AddInstructionsToQuestions < ActiveRecord::Migration[5.2]
  def change
    add_column :questions, :instructions, :text, after: :order
  end
end
