# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::User do
  let(:teacher) { create(:teacher, flags: ["private", "beta"]) }
  let(:subject1) { create(:subject_area, name: "subject 1")}
  let(:subject2) { create(:subject_area, name: "subject 2")}
  let(:subject3) { create(:subject_area, name: "subject 3")}
  let(:teacher_info) { create(:teacher_info, user: teacher) }

  before {
    create(:user_subscription, user: teacher)
    create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject1)
    create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject2)
    create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject3)
  }

  context '#identify_params' do

    it 'returns the expected params hash' do
      params = {
        user_id: teacher.id,
        traits: {
          **teacher.segment_user.common_params,
          auditor: teacher.auditor?,
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email,
          flags: teacher.flags&.join(", "),
          flagset: teacher.flagset,
          minimum_grade_level: teacher_info.minimum_grade_level,
          maximum_grade_level: teacher_info.maximum_grade_level,
          subject_areas: teacher_info.subject_areas.map(&:name).join(", ")
        }.reject {|_,v| v.nil? },
        integrations: teacher.segment_user.integration_rules
      }
      expect(teacher.segment_user.identify_params).to eq params
    end
  end

  context '#common_params' do

    it 'returns the expected params hash' do
      params = {
        district: teacher.school&.district&.name,
        school_id: teacher.school&.id,
        school_name: teacher.school&.name,
        premium_state: teacher.premium_state,
        premium_type: teacher.subscription&.account_type,
        is_admin: teacher.admin?,
        minimum_grade_level: teacher_info.minimum_grade_level,
        maximum_grade_level: teacher_info.maximum_grade_level,
        subject_areas: teacher_info.subject_areas.map(&:name).join(", ")
      }.reject {|_,v| v.nil? }
      expect(teacher.segment_user.common_params).to eq params
    end
  end

  context '#premium_params' do

    it 'returns the expected params hash' do
      params = {
        email: teacher.email,
        premium_state: teacher.premium_state,
        premium_type: teacher.subscription&.account_type
      }.reject {|_,v| v.nil? }
      expect(teacher.segment_user.premium_params).to eq params
    end
  end

  context '#integration_rules' do

    it 'returns the expected params hash for no user' do
      expect(teacher.segment_user.integration_rules).to eq({ all: true, Intercom: true })
    end
  end
end
