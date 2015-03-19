require 'rails_helper'

describe CsvExportWorker, type: :worker do
  let(:worker) { CsvExportWorker.new }
  let(:csv_export) { FactoryGirl.create(:csv_export, teacher: teacher)}
  let(:teacher) { FactoryGirl.create(:teacher) }

  subject { worker.perform(csv_export.id) }

  context 'when the csv has not been generated yet' do
    it 'generates the CSV' do
      subject
      expect(csv_export.reload.csv_file.url).to_not be_nil
    end

    it 'sends an email to the teacher' do
      expect {
        subject
      }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it 'marks the export as having been processed' do
      subject
      expect(csv_export.reload).to be_sent
    end
  end

  context 'when the csv has already been generated' do
    before do
      csv_export.emailed_at = 2.days.ago
      csv_export.save!
    end

    it 'does not re-generate the CSV' do
      subject
       # Expect nil because it's never been generated
      expect(csv_export.reload.csv_file.url).to be_nil
    end

    it 'does not re-send the email' do
      expect {
        subject
      }.to_not change { ActionMailer::Base.deliveries.count }
    end
  end
end