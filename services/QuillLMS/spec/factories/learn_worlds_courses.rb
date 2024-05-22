# frozen_string_literal: true

# == Schema Information
#
# Table name: learn_worlds_courses
#
#  id          :bigint           not null, primary key
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string           not null
#
# Indexes
#
#  index_learn_worlds_courses_on_external_id  (external_id) UNIQUE
#
FactoryBot.define do
  factory :learn_worlds_course do
    external_id { SecureRandom.hex(12) }
    title { Faker::Book.title }
  end
end
