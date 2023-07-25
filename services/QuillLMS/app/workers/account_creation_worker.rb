# frozen_string_literal: true

class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = Analytics::Analyzer.new
    return unless @user.teacher?

    events = [Analytics::SegmentIo::BackgroundEvents::TEACHER_ACCOUNT_CREATION]
    events += [Analytics::SegmentIo::BackgroundEvents::TEACHER_SIGNED_UP_FOR_NEWSLETTER] if @user.send_newsletter
    analytics.track_chain(@user, events)
  end
end
