# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms
#
#  id                  :integer          not null, primary key
#  code                :string
#  grade               :string
#  grade_level         :integer
#  name                :string
#  synced_name         :string
#  visible             :boolean          default(TRUE), not null
#  created_at          :datetime
#  updated_at          :datetime
#  clever_id           :string
#  google_classroom_id :bigint
#  teacher_id          :integer
#
# Indexes
#
#  index_classrooms_on_clever_id            (clever_id)
#  index_classrooms_on_code                 (code)
#  index_classrooms_on_google_classroom_id  (google_classroom_id)
#  index_classrooms_on_grade                (grade)
#  index_classrooms_on_grade_level          (grade_level)
#  index_classrooms_on_teacher_id           (teacher_id)
#
class ClassroomSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :grade, :updated_at

end
