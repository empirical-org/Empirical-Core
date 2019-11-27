class RemoveUniquenessOfUidInQuestions < ActiveRecord::Migration
  def up
    remove_index :questions, :uid
    add_index :questions, :uid
  end
end
