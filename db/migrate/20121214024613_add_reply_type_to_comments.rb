class AddReplyTypeToComments < ActiveRecord::Migration
  def change
    add_column :comments, :reply_type, :string
  end
end
