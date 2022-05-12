# frozen_string_literal: true

class IntercomWebhookController < ApplicationController
  before_action :verify_signature, only: [:create]

  def create

  end

  private def verify_signature
    client_secret = ENV.fetch('INTERCOM_APP_SECRET', '')
    hexdigest = Digest::SHA1.hexdigest("#{client_secret}#{request.body}")
    unless request.headers['X-Hub-Signature'] == "sha1=#{hexdigest}"
      ErrorNotifier.report(new Error("unauthorized call of Intercom webhook"))
      head :forbidden
    end
  end
end
