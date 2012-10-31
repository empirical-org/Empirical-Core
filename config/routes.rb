PGSite::Application.routes.draw do
  resource :session

  root to: 'pages#home'
end
