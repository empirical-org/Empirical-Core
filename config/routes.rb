PGSite::Application.routes.draw do
  CMS::Routes.new(self).draw
  HoneyAuth::Routes.new(self).draw

  root to: 'pages#home'
  get 'about' => 'pages#about'
  get 'teachers' => 'pages#teachers'
  get 'middle_school' => 'pages#middle_school'
end
