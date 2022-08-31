# frozen_string_literal: true

class SendAttachmentMailer < ApplicationMailer
  default from: 'hello@quill.org'

  def send_attached_file(recipient, subject, file_name, file_stream)
    attachments[file_name] = file_stream
    mail(to: recipient, subject: subject) do |format|
      format.text { render(plain: "'#{file_name}' attached.") }
    end
  end

  # send multiple files of the same type
  def send_multiple_files(recipient, subject, file_hash)
    file_hash.each do |name, file|
      attachments[name] = file
    end

    mail(to: recipient, subject: subject) do |format|
      format.text { render(plain: "'#{file_hash.keys.join(', ')}' attached.") }
    end
  end
end
