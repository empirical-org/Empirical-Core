class AddSendNewsletterToUser < ActiveRecord::Migration
  def change
    add_column :users, :send_newsletter, :boolean, default: false
  end
end
