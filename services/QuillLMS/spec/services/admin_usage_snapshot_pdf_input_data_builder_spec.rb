# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AdminUsageSnapshotPdfInputDataBuilder do
  subject { described_class.run(admin_report_filter_selection) }

  let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }

  it { expect(subject).to be_a Hash}
end
