class AddSpellingErrorToResponses < ActiveRecord::Migration[5.1]
  def change
    add_column :responses, :spelling_error, :boolean, default: false
  end
end
