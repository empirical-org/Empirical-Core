require 'sidekiq/web'

EmpiricalGrammar::Application.routes.draw do
  use_doorkeeper

  # authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  # end

  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset
  resources :schools, only: [:index], format: 'json'
  resources :activity_sessions, only: [:show]

  resources :activities, only: [:show] do
    get :start, on: :member
    get :resume, on: :member
    get :retry, on: :member
  end

  namespace :teachers do
    resources :classrooms do
      resources :units
      resources :activities, controller: 'classroom_activities'

      resources :students do
        put :reset_password
      end

      # TODO: abstract this list as well. Duplicated in nav in layout.
      %w(scorebook lesson_planner invite_students accounts import).each do |page|
        get page => "classroom_manager##{page}"
      end
    end
  end

  # API routes
  namespace :api do
    namespace :v1 do
      resources :activities,              except: [:index, :new, :edit]
      resources :activity_sessions,       except: [:index, :new, :edit]

      resource :me, controller: 'me',     except: [:index, :new, :edit, :destroy]
      resource :ping, controller: 'ping', except: [:index, :new, :edit, :destroy]
    end

    # Try to route any GET, DELETE, POST, PUT or PATCH to the proper controller.
    # This converts requests like GET /v1/ping to /api/v1/ping, and also
    # /ping to /api/v1/ping.
    #
    # These routes are lost since they are globs, and thus will match anything
    # not previously matched.
    # [:get, :delete, :post, :put, :patch].each do |method|
    #   match 'v:api/*path', to: redirect("/api/v1/%{path}"), via: method
    #   match '*path', to: redirect("/api/v1/%{path}"), via: method
    # end
  end

  resource :session, :account
  get '/auth/clever/callback', to: 'sessions#clever'
  get '/auth/failure', to: 'sessions#failure'

  CMS::Routes.new(self).draw do
    resources :categories
    resources :rule_questions
    resources :rules
    resources :sections
    resources :activity_classifications
    resources :topics

    resources :activities, path: 'activity_type/:key/activities' do
      resource :data
    end

    resources :users do
      collection do
        match 'search' => 'users#search', via: [:get, :post], as: :search
      end
      member do
        put :sign_in
      end
    end
  end

  %w(middle_school story about learning develop mission faq tos privacy lessons new).each do |page|
    get page => "pages##{page}"
  end

  patch 'verify_question' => 'chapter/practice#verify'
  get   'verify_question' => 'chapter/practice#verify_status'
  patch 'cheat'           => 'chapter/practice#cheat'
  get '404' => 'errors#error_404'
  get '500' => 'errors#error_500'

  root to: 'pages#home'

  # catch-all 404
  get '*path', :to => 'application#routing_error'
end
