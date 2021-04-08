module SessionHelper
  def user_params hash = {}
    {
      name: 'John Smith',
      email: 'user@example.com',
      password: '123456',
      role: 'teacher'
    }.merge(hash)
  end

  def sign_in(*args)
    user = args.first if args.length == 1
    email, password = user ? [user.email || user.username, user.password] : args
    password = password.presence || '123456'
    post '/session', 
      params:  {
        user: {
          email: email, 
          password: password
        }
      }
  end
end
