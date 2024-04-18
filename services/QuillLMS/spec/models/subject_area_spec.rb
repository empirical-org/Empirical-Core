# frozen_string_literal: true

# == Schema Information
#
# Table name: subject_areas
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'spec_helper'

describe SubjectArea, type: :model, redis: true do


  it { should have_many(:teacher_info_subject_areas) }
  it { should validate_presence_of(:name) }

  context 'uniqueness' do
    let!(:subject_area) { create(:subject_area) }

    it { should validate_uniqueness_of(:name) }
  end

end
