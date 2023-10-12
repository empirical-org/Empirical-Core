# frozen_string_literal: true

class PayloadHasher < ApplicationService
  attr_reader :payload

  def initialize(payload)
    @payload = payload
  end

  # Should produce the same output as frontend `client/app/bundles/PremiumHub/shared.tsx:hashPayload`
  def run
    Digest::MD5.hexdigest(payload.join('-'))
  end
end
