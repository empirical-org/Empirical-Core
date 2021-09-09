class AddHighlightPromptToPassages < ActiveRecord::Migration[5.0]
  def change
    add_column :comprehension_passages, :highlight_prompt, :string
  end
end
