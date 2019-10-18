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
end

