Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy]
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
