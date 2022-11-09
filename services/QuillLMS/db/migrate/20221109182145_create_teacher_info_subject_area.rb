class CreateTeacherInfoSubjectArea < ActiveRecord::Migration[6.1]
  def change
    create_table :teacher_info_subject_areas do |t|
      t.references :teacher_info
      t.references :subject_area

      t.timestamps
    end
  end
end
