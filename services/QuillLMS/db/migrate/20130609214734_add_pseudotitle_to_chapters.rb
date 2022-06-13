# frozen_string_literal: true

class AddPseudotitleToChapters < ActiveRecord::Migration[4.2]
  def up
    add_column :chapters, :description, :text
  end

  def down
    remove_column :chapters, :description
  end
end
