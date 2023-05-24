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
require 'rails_helper'

RSpec.describe LearnWorldsCourse, type: :model do
  subject { create(:learn_worlds_course) }

  it { should validate_uniqueness_of(:external_id) }

  it { expect(subject).to be_valid }
end
