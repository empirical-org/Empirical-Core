class AddUniqueResponseIndex < ActiveRecord::Migration[5.1]
  def change
    add_index :responses, [:question_uid, :text], unique: true
  end
end
