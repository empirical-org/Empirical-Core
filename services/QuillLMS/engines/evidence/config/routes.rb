# frozen_string_literal: true

Evidence::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    member do
      get :rules
      get :rules_with_plagiarism_texts
      get :change_logs
    end
  end

  resources :automl_models, only: [:index, :show, :create, :update, :destroy] do
    member do
      put :activate
    end
  end
  resource :feedback, only: [:create], controller: :feedback do
    post :prefilter
    post :opinion
    post :grammar
    post :automl
    post :plagiarism
    post 'regex/:rule_type' => :regex
    post :spelling
  end

  put 'rules/update_rule_order' => 'rules#update_rule_order'

  resources :rules, only: [:index, :show, :create, :update, :destroy] do
    collection { get :universal }
  end

  resources :turking_round_activity_sessions, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get :validate
    end
  end
  resources :turking_rounds, only: [:index, :show, :create, :update, :destroy]
end
