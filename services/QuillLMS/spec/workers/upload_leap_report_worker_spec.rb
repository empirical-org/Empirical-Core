# frozen_string_literal: true

require 'rails_helper'

describe UploadLeapReportWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:school) { create(:school) }

  it 'generates a school LEAP csv' do
    expect_any_instance_of(School).to receive(:generate_leap_csv)
    # We need to intercept this call because it'll fail without credentials
    expect(worker).to receive(:upload_data_to_s3)
    worker.perform(school.id)
  end

  it 'uploads data to S3' do
    expect(worker).to receive(:upload_data_to_s3)
    worker.perform(school.id)
  end

  describe '#current_academic_year_start' do
    it 'generates a report starting last August if current date is before August' do
      expected_start_date = Date.parse('2014-08-01')
      run_on_date = Date.parse('2015-01-10')
      expect(Date).to receive(:current).and_return(run_on_date)
      expect_any_instance_of(School).to receive(:generate_leap_csv).with(expected_start_date)
      expect(worker).to receive(:upload_data_to_s3)
      worker.perform(school.id)
    end

    it 'generates a report starting last August if current date is after August' do
      expected_start_date = Date.parse('2014-08-01')
      run_on_date = Date.parse('2014-09-10')
      expect(Date).to receive(:current).and_return(run_on_date)
      expect_any_instance_of(School).to receive(:generate_leap_csv).with(expected_start_date)
      expect(worker).to receive(:upload_data_to_s3)
      worker.perform(school.id)
    end
  end
end

