# frozen_string_literal: true

# == Schema Information
#
# Table name: schools_admins
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  school_id  :integer
#  user_id    :integer
#
# Indexes
#
#  index_schools_admins_on_school_id              (school_id)
#  index_schools_admins_on_school_id_and_user_id  (school_id,user_id) UNIQUE
#  index_schools_admins_on_user_id                (user_id)
#
FactoryBot.define do
  factory :schools_admins do
    school { create(:school) }
    user { create(:teacher) }
  end
end
