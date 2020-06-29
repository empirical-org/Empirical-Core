Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    resources :rule_sets, only: [:index, :show, :create, :update, :destroy]
  end
end
