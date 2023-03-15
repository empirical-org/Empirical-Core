# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                      :bigint           not null, primary key
#  maximum_grade_level     :integer
#  minimum_grade_level     :integer
#  role_selected_at_signup :string           default("")
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :bigint           not null
#
# Indexes
#
#  index_teacher_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :teacher_info do
    teacher { create(:user) }
    minimum_grade_level { 0 }
    maximum_grade_level { 12 }

    factory :teacher_info_with_subject_area do
      after(:create) do |teacher_info|
        create(:teacher_info_subject_area, teacher_info: teacher_info)
      end
    end
  end
end
