class DropPlagiarismColumnsFromPrompt < ActiveRecord::Migration
  def change
    remove_column :comprehension_prompts, :plagiarism_text
    remove_column :comprehension_prompts, :plagiarism_first_feedback
    remove_column :comprehension_prompts, :plagiarism_second_feedback
  end
end
