# frozen_string_literal: true

# == Schema Information
#
# Table name: subject_areas
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

describe SubjectArea, type: :model, redis: true do
  it { should have_many(:teacher_info_subject_areas) }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_uniqueness_of :name }
end
