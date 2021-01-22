class CreatePlagiarismTextTable < ActiveRecord::Migration
  def change
    create_table :comprehension_plagiarism_text do |t|
      t.references :prompt, null: false
      t.string :plagiarism_text, null: false
    end
    
  end
end
