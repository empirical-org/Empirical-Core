# frozen_string_literal: true

# == Schema Information
#
# Table name: milestones
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_milestones_on_name  (name)
#
require 'rails_helper'

describe Milestone, type: :model do
  it { should have_many(:user_milestones)}
  it { should have_many(:users).through(:user_milestones) }

  describe 'types' do
    it 'should have the correct types hash' do
      expect(Milestone::TYPES[:invite_a_coteacher]).to eq('Invite a Co-Teacher')
      expect(Milestone::TYPES[:refer_an_active_teacher]).to eq('Refer an Active Teacher')
      expect(Milestone::TYPES[:see_welcome_modal]).to eq('See Welcome Modal')
      expect(Milestone::TYPES[:acknowledge_diagnostic_banner]).to eq('Acknowledge Diagnostic Banner')
      expect(Milestone::TYPES[:acknowledge_evidence_banner]).to eq('Acknowledge Evidence Banner')
      expect(Milestone::TYPES[:acknowledge_lessons_banner]).to eq('Acknowledge Lessons Banner')
      expect(Milestone::TYPES[:acknowledge_growth_diagnostic_promotion_card]).to eq('Acknowledge Growth Diagnostic Promotion Card')
      expect(Milestone::TYPES[:dismiss_grade_level_warning]).to eq('Dismiss Grade Level Warning')
    end
  end
end
