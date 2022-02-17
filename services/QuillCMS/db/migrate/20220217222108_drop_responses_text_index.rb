class DropResponsesTextIndex < ActiveRecord::Migration[6.1]
  def up
    remove_index :responses, :text    
  end

  def down
    add_index :responses, :text
  end
end
