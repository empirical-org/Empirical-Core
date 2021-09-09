class AddPlagiarismColumnsToPrompt < ActiveRecord::Migration[4.2]
  def change
    add_column :comprehension_prompts, :plagiarism_text, :text
    add_column :comprehension_prompts, :plagiarism_first_feedback, :text
    add_column :comprehension_prompts, :plagiarism_second_feedback, :text
  end
end
