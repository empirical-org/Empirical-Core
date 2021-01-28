class DropPlagiarismColumnsFromPrompt < ActiveRecord::Migration
  def change
    remove_column :comprehension_prompt, :plagiarism_text
    remove_column :comprehension_prompt, :plagiarism_first_feedback
    remove_column :comprehension_prompt, :plagiarism_second_feedback
  end
end
