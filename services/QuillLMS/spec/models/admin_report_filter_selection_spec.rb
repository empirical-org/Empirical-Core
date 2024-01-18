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

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:pdf_subscriptions).dependent(:destroy) }
  end

  # TODO: update these
  describe '.segment_admin_report_subscriptions' do
    it 'returns unique segment names for reports with pdf subscriptions' do
      # Setup test data with pdf_subscriptions and admin_report_filter_selections
      # ...

      expect(described_class.segment_admin_report_subscriptions).to match_array(['Usage Snapshot'])
      # Add more expectations as necessary
    end
  end

  describe 'instance methods' do
    let(:filter_selection) { create(:admin_report_filter_selection) }

    it 'returns classrooms from filter_selections' do
      expect(filter_selection.classrooms).to eq(filter_selection.filter_selections['classrooms']&.pluck('name'))
      # Add more expectations for other methods
    end

    # Continue testing other instance methods like `classroom_ids`, `custom_end`, `grades`, etc.
  end
end
