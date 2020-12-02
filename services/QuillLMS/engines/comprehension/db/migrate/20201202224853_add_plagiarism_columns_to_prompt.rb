class AddPlagiarismColumnsToPrompt < ActiveRecord::Migration
  def change
    add_column :comprehension_prompts, :plagiarism_text, :text
    add_column :comprehension_prompts, :plagiarism_feedback_one, :text
    add_column :comprehension_prompts, :plagiarism_feedback_two, :text
  end
end
