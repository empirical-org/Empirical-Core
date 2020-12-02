class AddPlagiarismColumnsToPrompt < ActiveRecord::Migration
  def change
    add_column :comprehension_prompts, :plagiarism_text, :text
    add_column :comprehension_prompts, :plagiarism_first_feedback, :text
    add_column :comprehension_prompts, :plagiarism_second_feedback, :text
  end
end
