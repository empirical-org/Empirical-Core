PGSite::Application.routes.draw do
  resource :session

  root to: 'pages#home'
  get 'the_peculiar_institution' => 'pages#the_peculiar_institution'
end
