class AddSendNewsletterToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :send_newsletter, :boolean, default: false
  end
end
