PGSite::Application.routes.draw do
  resource :session

  root to: 'pages#home'
  get 'the_peculiar_institution' => 'pages#the_peculiar_institution'
  get 'democracy_in_america' => 'pages#democracy_in_america'
  get 'aggregation' => 'pages#aggregation'
end
