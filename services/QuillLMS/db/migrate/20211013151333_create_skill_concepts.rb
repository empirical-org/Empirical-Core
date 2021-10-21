class CreateSkillConcepts < ActiveRecord::Migration[5.1]
  def change
    create_table :skill_concepts do |t|
      t.references :skill, index: true, foreign_key: true, null: false
      t.references :concept, index: true, foreign_key: true, null: false
    end
  end
end
