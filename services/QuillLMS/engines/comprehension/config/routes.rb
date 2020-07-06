Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    resources :rule_sets, only: [:index, :show, :create, :update, :destroy] do
      resources :rules, only: [:index, :show, :create, :update, :destroy]
    end
  end
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
