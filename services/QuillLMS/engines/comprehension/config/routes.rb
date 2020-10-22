Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    resources :rule_sets, only: [:index, :show, :create, :update, :destroy]
  end

  resources :feedback_histories, only: [:index, :show, :create, :update, :destroy]

  resources :rule_sets, only: [] do
    resources :rules, only: [:index, :show, :create, :update, :destroy]
  end

  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
