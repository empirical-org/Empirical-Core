# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pdfs::AdminUsageSnapshotReports::DataAggregator do
  subject { described_class.run(admin_report_filter_selection) }

  let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }

  let(:output) do
    {
      filter_sections: {
        classrooms: admin_report_filter_selection.classrooms,
        grades: admin_report_filter_selection.grades,
        schools: admin_report_filter_selection.schools,
        teachers: admin_report_filter_selection.teachers,
        timeframe_name: admin_report_filter_selection.timeframe_name
      },
      snapshot_sections: snapshot_sections
    }
  end

  let(:snapshot_sections) { { some_key: 'some_value' } }

  before do
    allow(Pdfs::AdminUsageSnapshotReports::SnapshotSectionsBuilder)
      .to receive(:run)
      .with(admin_report_filter_selection)
      .and_return(snapshot_sections)
  end

  it { is_expected.to eq output }
end
