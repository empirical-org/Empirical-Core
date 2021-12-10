# frozen_string_literal: true

class ELLStarterDiagnosticEmailJob
  include Sidekiq::Worker

  def perform(name, email)
    UserMailer.ell_starter_diagnostic_info_email(name, email).deliver_now!
  end
end