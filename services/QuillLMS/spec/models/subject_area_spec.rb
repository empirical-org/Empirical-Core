# frozen_string_literal: true

require 'rails_helper'

describe SubjectArea, type: :model, redis: true do
  it { should have_many(:teacher_info_subject_areas) }
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to validate_uniqueness_of :name }
end
