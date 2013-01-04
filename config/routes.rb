PGSite::Application.routes.draw do
  CMS::Routes.new(self).draw
  HoneyAuth::Routes.new(self).draw

  root to: 'pages#home'
  get 'the_peculiar_institution' => 'pages#the_peculiar_institution'
  get 'democracy_in_america' => 'pages#democracy_in_america'
  get 'aggregation' => 'pages#aggregation'

  resources :courses, :lectures, :questions

  resources :chapters do
    resources :comments
  end
end
