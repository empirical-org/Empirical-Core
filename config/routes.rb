EmpiricalGrammar::Application.routes.draw do
  use_doorkeeper
  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset
  resources :activity_sessions, only: [:show]

  resources :activities, only: [:show] do
    get :start, on: :member
    get :resume, on: :member
    get :retry, on: :member
  end

  namespace :teachers do
    resources :classrooms do
      resources :activities, controller: 'classroom_chapters'
      resources :students do
        put :reset_password
      end

      # TODO: abstract this list as well. Duplicated in nav in layout.
      %w(new_scorebook scorebook lesson_planner invite_students accounts import).each do |page|
        get page => "classroom_manager##{page}"
      end
    end
  end

  HoneyAuth::Routes.new(self).draw

  CMS::Routes.new(self).draw do
    resources :categories
    resources :rule_questions
    resources :chapters
    resources :rules
    resources :chapter_levels
    resources :activities, path: 'activity_type/:key/activities'
    resources :activity_classifications

    resources :users do
      member do
        put :sign_in
      end
    end
  end

  %w(middle_school story about learning develop mission faq tos lessons).each do |page|
    get page => "pages##{page}"
  end

  root to: 'pages#home'
end
