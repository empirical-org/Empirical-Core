class AddSkillGroupIdToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_reference :questions, :skill_group, foreign_key: true
  end
end
