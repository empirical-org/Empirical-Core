Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy]
end
