PGSite::Application.routes.draw do
  resources :rules


  resources :workbooks


  resources :lessons


  resources :assessments


  resources :chapters


  resources :users


  CMS::Routes.new(self).draw
  HoneyAuth::Routes.new(self).draw

  root to: 'pages#home'
  get 'about' => 'pages#about'
  get 'teachers' => 'pages#teachers'
  get 'middle_school' => 'pages#middle_school'
  
  get 'profile' => 'users#show'
  get 'assign' => 'users#assign'
  get 'next_chapter' => 'chapters#next'
  get 'previous_chapter' => 'chapters#previous'

end
