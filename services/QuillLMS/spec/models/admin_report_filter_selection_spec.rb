# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_report_filter_selections
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb            not null
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
require 'rails_helper'

RSpec.describe AdminReportFilterSelection, type: :model, redis: true do
  it { expect(build(:admin_report_filter_selection)).to be_valid }

  it { should belong_to(:user) }

  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:filter_selections) }
  it { should validate_inclusion_of(:report).in_array(described_class::REPORTS)}
end
