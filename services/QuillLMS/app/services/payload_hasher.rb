# frozen_string_literal: true

class PayloadHasher < ApplicationService
  attr_reader :payload

  def initialize(payload)
    @payload = payload
  end

  def run
    Digest::SHA256.hexdigest(payload.join('-'))
  end
end
