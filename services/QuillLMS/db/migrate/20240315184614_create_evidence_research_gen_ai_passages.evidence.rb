# This migration comes from evidence (originally 20240315184312)
class CreateEvidenceResearchGenAiPassages < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passages do |t|
      t.text :full_text
      t.text :abridged_text

      t.timestamps
    end
  end
end
