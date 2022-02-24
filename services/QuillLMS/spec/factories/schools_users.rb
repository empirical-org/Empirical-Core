# frozen_string_literal: true

# == Schema Information
#
# Table name: schools_users
#
#  id        :integer          not null, primary key
#  school_id :integer
#  user_id   :integer
#
# Indexes
#
#  index_schools_users_on_school_id              (school_id)
#  index_schools_users_on_school_id_and_user_id  (school_id,user_id)
#  index_schools_users_on_user_id                (user_id) UNIQUE
#
FactoryBot.define do
  factory :schools_users do
    school { create(:school) }
    user { create(:teacher) }
  end
end
