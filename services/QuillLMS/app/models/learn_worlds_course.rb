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
class LearnWorldsCourse < ApplicationRecord
  has_many :learn_worlds_account_course_events, dependent: :destroy

  validates :title, presence: true
  validates :external_id, presence: true, uniqueness: true

  def self.titles_string
    pluck(:title).join(',')
  end
end
