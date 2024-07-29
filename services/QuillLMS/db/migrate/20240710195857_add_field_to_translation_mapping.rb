# frozen_string_literal: true

class AddFieldToTranslationMapping < ActiveRecord::Migration[7.0]
  def up
    add_column :translation_mappings, :field_name, :string

    # Update existing records
    execute <<-SQL
      UPDATE translation_mappings
      SET field_name = CASE
        WHEN source_type = 'Activity' THEN 'landingPageHtml'
        WHEN source_type = 'Question' THEN 'instructions'
        WHEN source_type = 'ConceptFeedback' THEN 'description'
      END
    SQL

    # Add a not-null constraint after updating
    change_column_null :translation_mappings, :field_name, false
  end

  def down
    remove_column :translation_mappings, :field_name
  end
end
