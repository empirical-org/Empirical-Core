# frozen_string_literal: true

GengoAPI = Gengo::API.new({
  private_key: ENV["GENGO_PRIVATE_KEY"],
  public_key: ENV["GENGO_PUBLIC_KEY"],
  sandbox: !Rails.env.production?
})
