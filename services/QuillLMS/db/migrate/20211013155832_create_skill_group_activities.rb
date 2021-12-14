# frozen_string_literal: true

class CreateSkillGroupActivities < ActiveRecord::Migration[5.1]
  def change
    create_table :skill_group_activities do |t|
      t.references :activity, index: true, foreign_key: true, null: false
      t.references :skill_group, index: true, foreign_key: true, null: false
    end
  end
end
