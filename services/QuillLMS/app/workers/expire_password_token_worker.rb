# frozen_string_literal: true

class ExpirePasswordTokenWorker
  include Sidekiq::Worker

  class UserNotFoundError < StandardError; end

  def perform(user_id)
    return if user_id.nil?

    user = User.find_by(id: user_id)
    return ErrorNotifier.report(UserNotFoundError, user_id: user_id) if user.nil?

    user.update!(token: nil)
  end
end
