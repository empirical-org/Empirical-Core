# == Schema Information
#
# Table name: students_classrooms
#
#  id           :integer          not null, primary key
#  visible      :boolean          default(TRUE), not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer
#  student_id   :integer
#
# Indexes
#
#  index_students_classrooms_on_classroom_id                 (classroom_id)
#  index_students_classrooms_on_student_id                   (student_id)
#  index_students_classrooms_on_student_id_and_classroom_id  (student_id,classroom_id) UNIQUE
#
FactoryBot.define do
  factory :students_classrooms, class: StudentsClassrooms do
    student { create(:student) }
    classroom { create(:classroom) }
  end
end
