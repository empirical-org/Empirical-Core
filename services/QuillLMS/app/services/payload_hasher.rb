# frozen_string_literal: true

class PayloadHasher < ApplicationService
  attr_reader :payload_hash

  def initialize(payload_hash)
    @payload_hash = payload_hash
  end

  # Should produce the same output as frontend `client/app/bundles/PremiumHub/shared.tsx:hashPayload`
  def run
    Digest::MD5.hexdigest(payload_hash.join('-'))
  end
end
