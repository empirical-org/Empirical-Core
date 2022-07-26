# frozen_string_literal: true

require 'rails_helper'

describe SendAttachmentMailer, type: :mailer do

  describe '#send_attached_file' do
    let(:recipient) { 'test@email.com' }
    let(:email_subject) { 'Test Subject' }
    let(:file_name) { 'file_name.csv' }
    let(:file_stream) { 'the contents of the file as a string' }

    it 'sets the attachment value' do
      allow_any_instance_of(SendAttachmentMailer).to receive(:mail)

      subject.send_attached_file(recipient, email_subject, file_name, file_stream)

      expect(subject.attachments[file_name].body).to eq(file_stream)
    end

    it 'calls "mail" as expected' do
      expect_any_instance_of(SendAttachmentMailer).to receive(:mail).with(to: recipient, subject: email_subject)

      subject.send_attached_file(recipient, email_subject, file_name, file_stream)
    end
  end
end
