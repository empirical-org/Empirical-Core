# frozen_string_literal: true

Evidence::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    member do
      get :activity_versions
      get :change_logs
      get :invalid_higlights
      put :increment_version
      get :rules
      get :topic_optimal_info
      post :labeled_synthetic_data
      post :seed_data
    end
  end

  resources :automl_models, only: [:index, :show, :create, :update, :destroy] do
    member do
      put :activate
    end
  end
  resource :feedback, only: [:create], controller: :feedback

  resources :hints, only: [:index, :show, :create, :update, :destroy]
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

  resources :activity_healths, only: [:index]

  resources :prompt_healths, only: [:index]
end
