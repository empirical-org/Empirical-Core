# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                  :bigint           not null, primary key
#  minimum_grade_level :integer
#  maximum_grade_level :integer
#  teacher_id          :bigint
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
FactoryBot.define do
  factory :teacher_info do
    teacher { create(:user) }
    minimum_grade_level { 0 }
    maximum_grade_level { 12 }
  end
end
