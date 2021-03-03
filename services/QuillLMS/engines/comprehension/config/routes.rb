Comprehension::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    member do
      get :rules
    end
  end

  resources :automl_models, only: [:index, :show, :create, :update, :destroy] do
    member do
      put :activate
    end
  end
  namespace :feedback do
    post :automl
    post :plagiarism
    post 'regex/:rule_type' => :regex
  end
  resources :rules, only: [:index, :show, :create, :update, :destroy]
  resources :turking_round_activity_sessions, only: [:index, :show, :create, :update, :destroy]
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
