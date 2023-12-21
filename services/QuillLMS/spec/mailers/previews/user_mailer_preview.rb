# frozen_string_literal: true

  class UserMailerPreview < ActionMailer::Preview
    def ell_starter_diagnostic_info_email
      UserMailer.ell_starter_diagnostic_info_email('pk', 'pkong@quill.org')
    end
  end
