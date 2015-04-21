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

  resources :activities, only: [:show, :update] do
    post :retry, on: :member
  end

  get :porthole_proxy, to: 'porthole_proxy#index'

  namespace :teachers do
    resources :units, as: 'units_path'  # moved from within classroom, since units are now cross-classroom
    resources :classroom_activities, only: [:destroy, :update], as: 'classroom_activities_path'

    namespace :progress_reports do
      resources :activity_sessions, only: [:index]
      resources :csv_exports, only: [:create]

      resources :concept_categories, only: [:index] do
        resources :concept_tags, only: [:index] do
          resources :students, controller: "concept_tags_students", only: [:index]
        end
      end

      namespace :standards do
        resources :classrooms, only: [:index] do
          resources :students, controller: "classroom_students", only: [:index] do
            resources :topics, controller: "student_topics", only: [:index]
          end

          resources :topics, controller: "classroom_topics", only: [:index] do
            resources :students, controller: "topic_students", only: [:index]
          end
        end
      end
    end

    resources :classrooms do
      collection do
        get :regenerate_code
        get :lesson_planner, controller: "classroom_manager", action: 'lesson_planner'
        get :scorebook, controller: 'classroom_manager', action: 'scorebook'
        get :scores, controller: 'classroom_manager', action: 'scores'
        get :search_activities, controller: 'classroom_manager', action: 'search_activities'
        get :retrieve_classrooms_for_assigning_activities, controller: 'classroom_manager', action: 'retrieve_classrooms_for_assigning_activities'
        post :assign_activities, controller: 'classroom_manager', action: 'assign_activities'
      end

      resources :activities, controller: 'classroom_activities'

      resources :students do
        put :reset_password
      end

      # TODO: abstract this list as well. Duplicated in nav in layout.
      %w(invite_students accounts import).each do |page|
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

  # for some reason, session_path with method :delete does not evaluate correctly in profiles/student.html.erb
  # so we have the patch below:
  get '/session', to: 'sessions#destroy'
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
    resources :topic_categories

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

  %w(middle_school story learning develop mission faq tos privacy activities new impact stats team premium_access premium).each do |page|
    get page => "pages##{page}", as: "#{page}"
  end

  get 'lessons' => 'pages#activities' # so that old links still work
  get 'about' => 'pages#activities' # so that old links still work

  get 'demo' => 'teachers/progress_reports/standards/classrooms#demo'

  patch 'verify_question' => 'chapter/practice#verify'
  get   'verify_question' => 'chapter/practice#verify_status'
  patch 'cheat'           => 'chapter/practice#cheat'
  get '404' => 'errors#error_404'
  get '500' => 'errors#error_500'

  root to: 'pages#home'

  # catch-all 404
  get '*path', :to => 'application#routing_error'
end
