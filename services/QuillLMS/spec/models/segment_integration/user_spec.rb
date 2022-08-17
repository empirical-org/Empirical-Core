# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::User do
  let(:teacher1) { create(:teacher) }
  let(:teacher2) { create(:teacher, flags: ["private", "beta"]) }

  context '#identify_params' do

    it 'returns the expected params hash' do
      params = {
        user_id: teacher1.id,
        traits: {
          **teacher1.segment_user.common_params,
          auditor: teacher1.auditor?,
          first_name: teacher1.first_name,
          last_name: teacher1.last_name,
          email: teacher1.email,
          flags: teacher1.flags&.join(", ")
        }.reject {|_,v| v.nil? },
        integrations: teacher1.segment_user.integration_rules
      }
      expect(teacher1.segment_user.identify_params).to eq params
    end

    it 'returns a comma separated string value for the flags array' do
      expect(teacher2.segment_user.identify_params[:traits][:flags]).to eq "private, beta"
    end
  end

  context '#common_params' do

    it 'returns the expected params hash' do
      params = {
        district: teacher1.school&.district&.name,
        school_id: teacher1.school&.id,
        school_name: teacher1.school&.name,
        premium_state: teacher1.premium_state,
        premium_type: teacher1.subscription&.account_type,
        is_admin: teacher1.admin?
      }.reject {|_,v| v.nil? }
      expect(teacher1.segment_user.common_params).to eq params
    end
  end

  context '#integration_rules' do

    it 'returns the expected params hash for no user' do
      expect(teacher1.segment_user.integration_rules).to eq({ all: true, Intercom: true })
    end
  end
end
