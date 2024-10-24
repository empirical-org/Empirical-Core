# frozen_string_literal: true

# This migration comes from evidence (originally 20241024174949)
class ChangeStemVaultIdToDatasetIdInEvidenceResearchGenAIGuidelines < ActiveRecord::Migration[7.1]
  def up
    add_column :evidence_research_gen_ai_guidelines, :notes, :text
    add_column :evidence_research_gen_ai_guidelines, :dataset_id, :integer

    Evidence::Research::GenAI::Guideline.reset_column_information

    # Backfill
    Evidence::Research::GenAI::Guideline.find_each do |guideline|
      Evidence::Research::GenAI::StemVault.find(guideline.stem_vault_id).datasets.each do |dataset|
        new_guideline = Evidence::Research::GenAI::Guideline.find_or_create_by!(
          dataset_id: dataset.id,
          stem_vault_id: guideline.stem_vault_id,
          curriculum_assigned_status: guideline.curriculum_assigned_status,
          text: guideline.text,
          visible: guideline.visible
        )

        dataset.trials.each do |trial|
          trial
            .llm_prompt
            .llm_prompt_guidelines
            .where(guideline_id: guideline.id)
            .update_all(guideline_id: new_guideline.id)
        end

        # This guideline dataset_id still nil, so we need to destroy it
        guideline.destroy
      end
    end

    add_index :evidence_research_gen_ai_guidelines, :dataset_id
    remove_column :evidence_research_gen_ai_guidelines, :stem_vault_id
  end

  def down
    add_column :evidence_research_gen_ai_guidelines, :stem_vault_id, :integer

    Evidence::Research::GenAI::Guideline.reset_column_information

    # Backfill stem_vault_id from associated dataset
    Evidence::Research::GenAI::Guideline.find_each do |guideline|
      guideline.update(stem_vault_id: guideline.dataset.stem_vault_id)
    end

    change_column_null :evidence_research_gen_ai_guidelines, :stem_vault_id, false

    remove_index :evidence_research_gen_ai_guidelines, :dataset_id
    remove_column :evidence_research_gen_ai_guidelines, :dataset_id
    remove_column :evidence_research_gen_ai_guidelines, :notes
  end
end
