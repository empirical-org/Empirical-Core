def sign_in(user)
  user.admin? ? session[:admin_id] = user.id : session[:user_id] = user.id
end