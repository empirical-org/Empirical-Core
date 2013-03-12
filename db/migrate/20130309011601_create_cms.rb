class CreateCMS < ActiveRecord::Migration
  def change
    create_table :file_uploads do |t|
      t.string :name
      t.string :file
      t.text :description
      t.timestamps
    end

    create_table :page_areas do |t|
      t.string :name
      t.string :description
      t.text :content
      t.timestamps
    end

    create_table :grammar_tests do |t|
      t.text :text
      t.timestamps
    end

    create_table :grammar_rules do |t|
      t.string :identifier
      t.text :description
      t.timestamps
    end


  end
end
