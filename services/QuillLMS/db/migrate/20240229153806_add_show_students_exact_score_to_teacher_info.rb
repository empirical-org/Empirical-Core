class AddShowStudentsExactScoreToTeacherInfo < ActiveRecord::Migration[7.0]
  def change
    add_column :teacher_infos, :show_students_exact_score, :boolean, default: true, null: false
  end
end
