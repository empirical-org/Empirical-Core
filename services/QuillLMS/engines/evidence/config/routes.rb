# frozen_string_literal: true

Evidence::Engine.routes.draw do
  resources :activities, only: [:index, :show, :create, :update, :destroy] do
    member do
      get :rules
      get :change_logs
      put :increment_activity
    end
  end

  resources :automl_models, only: [:index, :show, :create, :update, :destroy] do
    member do
      put :activate
    end
  end
  resource :feedback, only: [:create], controller: :feedback

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
