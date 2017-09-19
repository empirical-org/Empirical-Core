class AccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(id, temp_password, admin_name)
    @user = User.find(id)
    @user.send_account_created_email(temp_password, admin_name)
  end
end
