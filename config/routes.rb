EmpiricalGrammar::Application.routes.draw do
  resources :categories
  resources :rules
  resources :lessons
  resources :assessments
  resources :assignments
  resource :profile

  resources :users do
    member do
      put :sign_in
    end
  end

  resources :chapters do
    resources :practice, step: 'practice' do
      get ':question_index' => :show
    end

    resources :review, controller: 'practice', step: 'review' do
      get ':question_index' => :show
    end

    resource :story
    get :final
    get :start
    get :resume
  end

  CMS::Routes.new(self).draw
  HoneyAuth::Routes.new(self).draw

  %w(teachers middle_school story about learning).each do |page|
    get page => "pages##{page}"
  end

  get "users/activate_email/:token", as: "activate_email", to: "users#activate_email"
  root to: "pages#home"
end
