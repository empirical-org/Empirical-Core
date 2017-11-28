require 'rails_helper'

describe CsvExportWorker, type: :worker do
  let(:worker) { CsvExportWorker.new }
  let(:csv_export) { create(:csv_export, teacher: teacher)}
  let(:teacher) { create(:teacher) }

  subject { worker.perform(csv_export.id, teacher.id) }

  skip 'generates the CSV' do
    subject
    expect(csv_export.reload.csv_file.url).to_not be_nil
  end

end
