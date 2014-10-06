class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)

    @user = User.find(id)

    # send email, subscriptions
    @user.send_welcome_email
    @user.subscribe_to_newsletter

    # tell mixpanel
    $mixpanel.try(:track, @user.id, 'account created')
    $mixpanel.try(:track, @user.id, "#{@user.role} created")


    # tell keen
    Keen.publish(:accounts, {event: 'creation', role: @user.role, classcode: @user.classcode})

  end
end
