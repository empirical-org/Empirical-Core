# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms_teachers
#
#  id           :integer          not null, primary key
#  order        :integer
#  role         :string           not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer          not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_classrooms_teachers_on_classroom_id             (classroom_id)
#  index_classrooms_teachers_on_role                     (role)
#  index_classrooms_teachers_on_user_id                  (user_id)
#  unique_classroom_and_user_ids_on_classrooms_teachers  (user_id,classroom_id) UNIQUE
#
FactoryBot.define do
  factory :classrooms_teacher do
    user          { create(:teacher) }
    classroom     { create(:classroom) }
    role          ClassroomsTeacher::ROLE_TYPES[:owner]
    order { nil }

    factory :coteacher_classrooms_teacher do
      role ClassroomsTeacher::ROLE_TYPES[:coteacher]
    end
  end
end
