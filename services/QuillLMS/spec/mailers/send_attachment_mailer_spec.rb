# frozen_string_literal: true

require 'rails_helper'

describe SendAttachmentMailer, type: :mailer do
  let(:recipient) { 'test@email.com' }
  let(:email_subject) { 'Test Subject' }

  describe '#send_attached_file' do
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


  describe '#send_multiple_files' do
    let(:file_name1) {'file_name1.csv'}
    let(:file_name2) {'file_name2.csv'}
    let(:file_contents1) {'the contents of the file as a string'}
    let(:file_contents2) {'the contents of the file as a string 2'}
    let(:file_hash) { {file_name1 => file_contents1, file_name2 => file_contents2} }

    it 'sets the attachments and calls mail' do

      subject.send_multiple_files(recipient, email_subject, file_hash)

      expect(subject.attachments[file_name1].body).to eq(file_contents1)
      expect(subject.attachments[file_name2].body).to eq(file_contents2)
      expect(subject.recipient).to eq(recipient)
      expect(subject.subject).to eq(email_subject)
    end
  end
end
