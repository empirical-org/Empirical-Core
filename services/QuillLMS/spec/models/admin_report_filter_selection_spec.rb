# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_report_filter_selections
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb
#  report            :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_admin_report_filter_selections_on_report   (report)
#  index_admin_report_filter_selections_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

describe AdminReportFilterSelection, type: :model, redis: true do
  it { should belong_to(:user) }

  it { should validate_presence_of(:user_id) }

  let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }

  describe '#report' do
    it "should allow valid values" do
      AdminReportFilterSelection::REPORTS.each do |v|
        admin_report_filter_selection.report = v
        expect(admin_report_filter_selection).to be_valid
      end
    end

    it "should not allow invalid values" do
      admin_report_filter_selection.report = nil
      expect(admin_report_filter_selection).not_to be_valid

      admin_report_filter_selection.report = 'other'
      expect(admin_report_filter_selection).not_to be_valid
    end
  end

end
