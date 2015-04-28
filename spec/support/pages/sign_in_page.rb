require_relative 'page'

class SignInPage < Page
  def self.path
    "#{BASE_PATH}/new"
  end

  def sign_in(user, using: :username,
                cred_case: :as_is)
    user_cred = user[using]
    user_cred.swapcase! if cred_case == :changed

    fill_in :user_email,    with: user_cred
    fill_in :user_password, with: user.password

    submit_form
  end

  def sign_in_failed_path
    BASE_PATH
  end

  def submit_form
    click_button 'Sign in'
  end

  private

  BASE_PATH = '/session'
end
