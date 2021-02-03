Comprehension::Engine.routes.draw do
  resources :rules, only: [:index, :show, :create, :update, :destroy]
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    resources :rule_sets, only: [:index, :show, :create, :update, :destroy]
    member do
      get :rules
    end
  end

  resources :rule_sets, only: [] do
    resources :regex_rules, only: [:index, :show, :create, :update, :destroy]
  end

  resources :turking_round_activity_sessions, only: [:index, :show, :create, :update, :destroy]
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]

  namespace :feedback do
    post :plagiarism
    post :regex
  end
end
