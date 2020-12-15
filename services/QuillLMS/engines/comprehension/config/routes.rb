Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    resources :rule_sets, only: [:index, :show, :create, :update, :destroy]
  end

  resources :rule_sets, only: [] do
    resources :rules, only: [:index, :show, :create, :update, :destroy]
  end

  resources :turking_round_activity_sessions, only: [:index, :show, :create, :update, :destroy]
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
