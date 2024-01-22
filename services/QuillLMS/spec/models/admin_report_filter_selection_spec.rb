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
  it { should have_many(:pdf_subscriptions).dependent(:destroy) }

  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:filter_selections) }
  it { should validate_inclusion_of(:report).in_array(described_class::REPORTS)}

  describe '.segment_admin_report_subscriptions' do
    subject { described_class.segment_admin_report_subscriptions }

    it { expect(subject).to match_array [] }

    context 'when there are pdf subscriptions' do
      let(:usage_snapshot) { described_class::SEGMENT_MAPPING[described_class::USAGE_SNAPSHOT_REPORT_PDF] }

      before { create(:pdf_subscription) }

      it { expect(subject).to match_array [usage_snapshot] }

      context 'when the report type is not mapped to segment' do
        let(:report) { described_class::USAGE_SNAPSHOT_REPORT }
        let(:admin_report_filter_selection) { create(:admin_report_filter_selection, report:) }

        before { create(:pdf_subscription, admin_report_filter_selection:) }

        it { expect(subject).to match_array [usage_snapshot] }
      end

      context 'when there are multiple pdf subscriptions' do
        before { create(:pdf_subscription) }

        it { expect(subject).to match_array [usage_snapshot] }
      end
    end
  end

  describe 'instance methods' do
    let(:admin_report_filter_selection) { build(:admin_report_filter_selection, :with_default_filters) }
    let(:filter_selections) { admin_report_filter_selection.filter_selections }

    describe '#classrooms' do
      subject { admin_report_filter_selection.classrooms }

      it { is_expected.to eq filter_selections['classrooms']&.pluck('name') }
    end

    describe '#classroom_ids' do
      subject { admin_report_filter_selection.classroom_ids }

      it { is_expected.to eq filter_selections['classrooms']&.pluck('value') }
    end

    describe '#custom_end' do
      subject { admin_report_filter_selection.custom_end }

      it { is_expected.to eq filter_selections['custom_end_date'].to_s }
    end

    describe '#custom_start' do
      subject { admin_report_filter_selection.custom_start }

      it { is_expected.to eq filter_selections['custom_start_date'].to_s }
    end

    describe '#grades' do
      subject { admin_report_filter_selection.grades }

      context 'when all grades are selected' do
        it { is_expected.to be_nil }
      end

      context 'when not all grades are selected' do
        before { allow(admin_report_filter_selection).to receive(:all_grades_selected?).and_return(false) }

        it { is_expected.to eq(admin_report_filter_selection.send(:selected_grades)) }
      end
    end

    describe '#grade_values' do
      subject { admin_report_filter_selection.grade_values }

      context 'when all grades are selected' do
        it { is_expected.to be_nil }
      end

      context 'when not all grades are selected' do
        before { allow(admin_report_filter_selection).to receive(:all_grades_selected?).and_return(false) }

        it { is_expected.to eq(admin_report_filter_selection.send(:selected_grade_values)) }
      end
    end

    describe '#teachers' do
      subject { admin_report_filter_selection.teachers }

      it { is_expected.to eq filter_selections['teachers']&.pluck('name') }
    end

    describe '#teacher_ids' do
      subject { admin_report_filter_selection.teacher_ids }

      it { is_expected.to eq filter_selections['teachers']&.pluck('value') }
    end

    describe '#schools' do
      subject { admin_report_filter_selection.schools }

      it { is_expected.to eq filter_selections['schools']&.pluck('name') }
    end

    describe '#school_ids' do
      subject { admin_report_filter_selection.school_ids }

      let(:school) { create(:school) }

      before { create(:schools_admins, user: admin_report_filter_selection.user, school:) }

      context 'when school ids are present in filter selections' do
        let(:selected_schools) { [{'id'=> school.id, 'name'=> school.name, 'label'=> school.name, 'value'=> school.id}] }

        before { filter_selections['schools'] = selected_schools }

        it { expect(subject).to eq [school.id] }
      end

      context 'when school ids are not present in filter selections' do
        let(:selected_schools) { nil }

        it { is_expected.to eq [school.id] }
      end
    end

    describe '#timeframe' do
      subject { admin_report_filter_selection.timeframe }

      it { is_expected.to eq Snapshots::Timeframes.find_timeframe(admin_report_filter_selection.send(:timeframe_value)) }
    end

    describe '#timeframe_name' do
      subject { admin_report_filter_selection.timeframe_name }

      it { is_expected.to eq filter_selections.dig('timeframe', 'name') }
    end

    describe '#timeframe_value' do
      subject { admin_report_filter_selection.timeframe_value }

      it { is_expected.to eq filter_selections.dig('timeframe', 'value') }
    end
  end

end
