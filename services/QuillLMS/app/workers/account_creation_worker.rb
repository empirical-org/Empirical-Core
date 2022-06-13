# frozen_string_literal: true

class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = Analyzer.new
    return unless @user.role.teacher?

    events = [SegmentIo::BackgroundEvents::TEACHER_ACCOUNT_CREATION]
    events += [SegmentIo::BackgroundEvents::TEACHER_SIGNED_UP_FOR_NEWSLETTER] if @user.send_newsletter
    analytics.track_chain(@user, events)
  end
end
