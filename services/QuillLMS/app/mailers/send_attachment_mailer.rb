# frozen_string_literal: true

class SendAttachmentMailer < ActionMailer::Base
  default from: 'hello@quill.org'

  def send_attached_file(recipient, subject, file_name, file_stream)
    attachments[file_name] = file_stream
    mail(to: recipient, subject: subject) do |format|
      format.text { render(plain: "'#{file_name}' attached.") }
    end
  end
end
