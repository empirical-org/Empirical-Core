require 'rails_helper'

describe CsvUploader, type: :uploader do
  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:csv_export) { FactoryGirl.create(:csv_export, teacher: teacher) }
  let(:uploader) { CsvUploader.new(csv_export, :csv_file) }

  describe 'filename' do
    before do
      Timecop.freeze(Time.local(2015, 9, 1, 12, 0, 0))
      expect(uploader).to receive(:original_filename) { 'barfoo' } # Test hack.
    end

    after do
      Timecop.return
    end

    it 'follows the correct format' do
      # Quill-Progress-Reports__09-01-15__a34332de3.csv
      expect(uploader.filename).to match(/Quill\-Progress\-Reports__09\-01\-15__[a-z0-9]{6}\.csv/)
    end
  end
end