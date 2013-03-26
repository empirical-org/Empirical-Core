PGSite::Application.routes.draw do
  CMS::Routes.new(self).draw
  HoneyAuth::Routes.new(self).draw

  root to: 'pages#home'
  get 'about' => 'pages#about'
end
