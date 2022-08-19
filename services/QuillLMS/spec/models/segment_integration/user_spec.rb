# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::User do
  let(:teacher) { create(:teacher, flags: ["private", "beta"]) }
  let(:subscription) { create(:subscription, expiration: Date.tomorrow) }
  let(:user_subscription) { create(:user_subscription, user: teacher, subscription: subscription) }

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
          flags: teacher.flags&.join(", ")
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
        is_admin: teacher.admin?
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
