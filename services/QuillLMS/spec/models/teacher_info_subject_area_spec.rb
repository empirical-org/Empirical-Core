# frozen_string_literal: true

require 'rails_helper'

describe TeacherInfoSubjectArea, type: :model, redis: true do
  it { should belong_to(:subject_area) }
  it { should belong_to(:teacher_info) }
end
