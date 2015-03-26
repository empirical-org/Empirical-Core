require 'rails_helper'

describe CsvExportMailer, type: :mailer do
  include ERB::Util

  describe 'csv_download' do
    let(:csv_export) { FactoryGirl.create(:csv_export, teacher: teacher) }
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:mail) { CsvExportMailer.csv_download(csv_export) }

    before do
      csv_export.export!
    end

    it 'renders the subject' do
      expect(mail.subject).to eq('Quill.org Teacher CSV Export')
    end

    it 'renders the receiver' do
      expect(mail.to).to eq([teacher.email])
    end

    it 'renders the sender' do
      expect(mail.from).to eq(['hello@quill.org'])
    end

    it 'contains the URL for the CSV' do
      expect(mail.body.encoded).to include(h(csv_export.csv_file.file.authenticated_url))
    end
  end
end