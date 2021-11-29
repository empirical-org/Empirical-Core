# frozen_string_literal: true

class ExpirePasswordTokenWorker
  include Sidekiq::Worker

  def perform(id)
    User.find(id)&.update!(token: nil)
  end

end
