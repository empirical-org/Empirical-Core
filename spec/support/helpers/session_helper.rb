module SessionHelper
  def user_params hash = {}
    {
      email: 'user@example.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'teacher'
    }.merge(hash)
  end

  def sign_in *args
    user = args.first if args.length == 1
    email, password = if user then [user.email || user.username, user.password] else args end
    password = password.presence || '123456'
    post '/session', user: {email: email, password: password}
  end
end
