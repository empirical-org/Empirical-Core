class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = Analyzer.new
    if @user.role == 'teacher'
      events = [SegmentIo::Events::STUDENT_ACCOUNT_CREATION]
      events += [SegmentIo::Events::TEACHER_SIGNED_UP_FOR_NEWSLETTER] if @user.send_newsletter
      analytics.track_chain(@user, events)
    elsif @user.role == 'student'
      analytics.track_with_attributes(
        @user,
        SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
        {
          context: {:ip => @user.ip_address },
          integrations: { intercom: 'false' }
        }
      )
    end
  end
end
