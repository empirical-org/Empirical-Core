require 'sidekiq/web'

EmpiricalGrammar::Application.routes.draw do


  mount RailsAdmin::Engine => '/staff', as: 'rails_admin'
  use_doorkeeper

  # authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  # end

  resources :admins, only: [:show], format: 'json' do
    resources :teachers, only: [:index, :create]
  end

  # for admins to sign in as teachers
  resources :users do
    member do
      get :admin_sign_in_classroom_manager, to: 'admins#sign_in_classroom_manager'
      get :admin_sign_in_progress_reports, to: 'admins#sign_in_progress_reports'
      get :admin_sign_in_account_settings, to: 'admins#sign_in_account_settings'
    end
  end

  # for Stripe
  resources :charges


  resources :subscriptions
  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset
  resources :schools, only: [:index], format: 'json'
  resources :students_classrooms do
    collection do
      get :add_classroom
      get :classroom_manager
      get :classroom_manager_data
    end

    member do
      post :teacher_hide
      post :hide
      post :unhide
    end

  end
  resources :unit_templates, only: [:index, :show], format: 'json'

  resources :activity_sessions, only: [] do
    get :anonymous, on: :collection
    get :play, on: :member
    put :play, on: :member
  end
  # 3rd party apps depend on the below, do not change :
  get 'activity_sessions/:uid' => 'activity_sessions#result'


  get 'students_classrooms_json' => 'profiles#students_classrooms_json'
  get 'student_profile_data' => 'profiles#student_profile_data'
  get 'student_mobile_profile_data/:current_classroom_id' => 'profiles#get_mobile_profile_data'


  resources :activities, only: [] do
    post :retry, on: :member
    get :search, on: :collection
  end

  resources :grades, only: [:index]

  get :current_user_json, controller: 'teachers', action: 'current_user_json'

  get 'account_settings' => 'students#account_settings'
  put 'make_teacher' => 'students#make_teacher'

  put 'teachers/update_current_user' => 'teachers#update_current_user'
  get 'teachers/classrooms_i_teach_with_students' => 'teachers#classrooms_i_teach_with_students'
  get 'teachers/classrooms_i_teach_with_lessons' => 'teachers#classrooms_i_teach_with_lessons'
  post 'teachers/classrooms/:class_id/unhide', controller: 'teachers/classrooms', action: 'unhide'
  get 'teachers/classrooms/:id/student_logins', only: [:pdf], controller: 'teachers/classrooms', action: 'generate_login_pdf', as: :generate_login_pdf, defaults: { format: 'pdf' }

  namespace :teachers do

    resources :units, as: 'units_path' do
      get :classrooms_with_students_and_classroom_activities, on: :member
      put :update_classroom_activities_assigned_students, on: :member
      put :update_activities, on: :member
    end # moved from within classroom, since units are now cross-classroom

    get 'prohibited_unit_names' => 'units#prohibited_unit_names'
    get 'last_assigned_unit_id' => 'units#last_assigned_unit_id'
    get 'diagnostic_units' => 'units#diagnostic_units'
    get 'lesson_units' => 'units#lesson_units'

    resources :unit_templates, only: [:index] do
      collection do
        get :profile_info, controller: 'unit_templates', action: 'profile_info'
        get :assigned_info, controller: 'unit_templates', action: 'assigned_info'
        post :fast_assign, controller: 'unit_templates', action: 'fast_assign'
      end
    end

    resources :classroom_activities, only: [:destroy, :update], as: 'classroom_activities_path' do
      collection do
        get 'lessons_activities_cache'
        put ':id/hide' => 'classroom_activities#hide'
        get ':id/activity_from_classroom_activity' => 'classroom_activities#activity_from_classroom_activity'
        put ':id/unlock_lesson' => 'classroom_activities#unlock_lesson'
      end
    end

    get 'getting_started' => 'classroom_manager#getting_started'
    get 'add_students' => 'classroom_manager#generic_add_students'
    get 'teacher_guide' => 'classroom_manager#teacher_guide'
    get 'my_account' => 'classroom_manager#my_account'
    get 'my_account_data' => 'classroom_manager#my_account_data'
    put 'update_my_account' => 'classroom_manager#update_my_account'
    post 'clear_data/:id' => 'classroom_manager#clear_data'
    put 'units/:id/hide' => 'units#hide', as: 'hide_units_path'
    get 'progress_reports/landing_page' => 'progress_reports#landing_page'
    namespace :progress_reports do
      resources :activity_sessions, only: [:index]
      resources :csv_exports, only: [:create]
      get 'report_from_activity_session/:activity_session' => 'diagnostic_reports#report_from_activity_session'
      get 'diagnostic_reports' => 'diagnostic_reports#show'
      get 'diagnostic_status' => 'diagnostic_reports#diagnostic_status'
      get 'diagnostic_report' => 'diagnostic_reports#default_diagnostic_report'
      get 'question_view/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#question_view'
      get 'classrooms_with_students/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#classrooms_with_students'
      get 'students_by_classroom/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#students_by_classroom'
      get 'recommendations_for_classroom/:classroom_id/activity/:activity_id' => 'diagnostic_reports#recommendations_for_classroom'
      get 'previously_assigned_recommendations/:classroom_id/activity/:activity_id' => 'diagnostic_reports#previously_assigned_recommendations'
      post 'assign_selected_packs' => 'diagnostic_reports#assign_selected_packs'

      namespace :concepts do
        resources :students, only: [:index] do
          resources :concepts, only: [:index]
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
        get :classrooms_i_teach
        get :regenerate_code
        get :archived_classroom_manager_data, controller: "classroom_manager", action: 'archived_classroom_manager_data'
        get :manage_archived_classrooms, controller: "classroom_manager", action: 'manage_archived_classrooms'
        get :lesson_planner, controller: "classroom_manager", action: 'lesson_planner', path: 'activity_planner'
        get 'lesson_planner', to: redirect { |params, request|
          "#{Rails.application.routes.url_helpers.lesson_planner_teachers_classrooms_path}?#{request.params.to_query}"
        }
        post :lesson_planner, controller: "classroom_manager", action: 'lesson_planner'
        get :assign_activities, controller: "classroom_manager", action: 'assign_activities', path: 'assign_activities'
        get :scorebook, controller: 'classroom_manager', action: 'scorebook'
        get :scores, controller: 'classroom_manager', action: 'scores'
        get :dashboard, controller: 'classroom_manager', action: 'dashboard'
        get :retrieve_classrooms_for_assigning_activities, controller: 'classroom_manager', action: 'retrieve_classrooms_for_assigning_activities'
        post :assign_activities, controller: 'classroom_manager', action: 'assign_activities'
        get :invite_students, controller: 'classroom_manager', action: 'invite_students'
        get :google_sync, controller: 'classroom_manager', action: 'google_sync'
        get :retrieve_google_classrooms, controller: 'classroom_manager', action: 'retrieve_google_classrooms'
        post :update_google_classrooms, controller: 'classroom_manager', action: 'update_google_classrooms'
        get :import_google_students, controller: 'classroom_manager', action: 'import_google_students'

        ##DASHBOARD ROUTES
        get :classroom_mini, controller: 'classroom_manager', action: 'classroom_mini'
        get :dashboard_query, controller: 'classroom_manager', action: 'dashboard_query'
        get :premium, controller: 'classroom_manager', action: 'premium'
      end

      member do
        get :hide #I am not sure why, however the first hide request on a classroom is always a get. Subsequent ones are put.
        post :hide
        get  :students_list, controller: 'classroom_manager', action: 'students_list'
      end
      #this can't go in with member because the id is outside of the default scope


      resources :activities, controller: 'classroom_activities'

      resources :students do
        put :reset_password
      end

      # TODO: abstract this list as well. Duplicated in nav in layout.
      %w(accounts import).each do |page|
        get page => "classroom_manager##{page}"
      end

    end
  end


  # API routes
  namespace :api do
    namespace :v1 do
      resources :activities,              except: [:index, :new, :edit]
      resources :activity_flags,          only: [:index]
      resources :activity_sessions,       except: [:index, :new, :edit]
      resources :sections,                only: [:index]
      resources :topics,                  only: [:index]
      resources :topic_categories,        only: [:index]
      resources :concepts,                only: [:index, :create]
      resources :users,                   only: [:index]
      resource :me, controller: 'me',     except: [:index, :new, :edit, :destroy]
      resource :ping, controller: 'ping', except: [:index, :new, :edit, :destroy]
      resource :firebase_tokens,          only: [:create]
      get 'classroom_activities/:id/student_names' => 'classroom_activities#student_names'
      put 'classroom_activities/:id/finish_lesson' => 'classroom_activities#finish_lesson'
      get 'classroom_activities/:id/teacher_and_classroom_name' => 'classroom_activities#teacher_and_classroom_name'
      get 'users/profile', to: 'users#profile'
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
  resource :session

  resource :account do
    post :role, to: 'accounts#role'
  end

  namespace :auth do
    get "/google_email_mismatch" => 'google#google_email_mismatch'
    get "/google_oauth2/callback" => 'google#google'
    get '/clever/callback', to: 'clever#clever'
  end

  get '/clever/auth_url_details', to: 'clever#auth_url_details'
  get '/auth/failure', to: 'sessions#failure'

  put '/select_school', to: 'accounts#select_school'

  namespace :cms do
    resources :admin_accounts, only: [:index, :create, :update, :destroy]
    resources :admins, only: [:index, :create, :update, :destroy]
    resources :categories
    resources :concepts
    resources :sections
    resources :activity_classifications
    resources :topics
    resources :topic_categories
    resources :authors, only: [:index, :create, :update, :destroy]
    resources :unit_templates, only: [:index, :create, :update, :destroy]
    resources :unit_template_categories, only: [:index, :create, :update, :destroy]

    resources :activities, path: 'activity_type/:activity_classification_id/activities' do
      resource :data
    end

    resources :users do
      resource :subscription

      collection do
        match 'search' => 'users#search', via: [:get, :post], as: :search
      end
      member do
        get :show_json
        put :sign_in
        put :clear_data
        get :sign_in
      end
    end
  end

  # tooltip is just for prototyping tooltip, if its still there you can remove it.

  other_pages = %w(tooltip beta board press blog_posts supporters partners middle_school story learning develop mission faq tos privacy activities new impact stats team premium teacher_resources media_kit play media news home_new map firewall_info)
  all_pages = other_pages
  all_pages.each do |page|
    get page => "pages##{page}", as: "#{page}"
  end

  tools = %w(diagnostic_tool connect_tool grammar_tool proofreader_tool)
  tools.each do |tool|
    get "tools/#{tool.chomp('_tool')}" => "pages##{tool}"
  end

  get 'activities/section/:section_id' => 'pages#activities', as: "activities_section"
  get 'activities/packs' => 'teachers/unit_templates#index'
  get 'activities/packs/diagnostic', to: redirect('/tools/diagnostic')
  get 'activities/packs/:id' => 'teachers/unit_templates#index'
  get 'activities/packs/category/:category' => 'teachers/unit_templates#index'
  get 'activities/packs/grade/:grade' => 'teachers/unit_templates#index'

  get 'teachers/classrooms/activity_planner/:tab' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/students/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit/:unitName' => 'teachers/classroom_manager#lesson_planner'

  get 'teachers/classrooms/assign_activities/:tab' => 'teachers/classroom_manager#assign_activities'
  get 'teachers/classrooms/assign_activities/featured-activity-packs/category/:category' => 'teachers/classroom_manager#assign_activities'
  get 'teachers/classrooms/assign_activities/featured-activity-packs/grade/:grade' => 'teachers/classroom_manager#assign_activities'
  get 'teachers/classrooms/assign_activities/featured-activity-packs/:activityPackId' => 'teachers/classroom_manager#assign_activities'
  get 'teachers/classrooms/assign_activities/featured-activity-packs/:activityPackId/assigned' => 'teachers/classroom_manager#assign_activities'
  get 'teachers/classrooms/assign_activities/new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray' => 'teachers/classroom_manager#assign_activities'

  # Count route to get quantities
  get 'count/featured_packs' => 'teachers/unit_templates#count'
  get 'count/activities' => 'activities#count'

  get 'lessons' => 'pages#activities' # so that old links still work
  get 'about' => 'pages#activities' # so that old links still work
  get 'diagnostic/:activityId' =>'activities#diagnostic' # placeholder til we find where this goes
  get 'diagnostic/:activityId/stage/:stage' => 'activities#diagnostic'
  get 'diagnostic/:activityId/success' => 'activities#diagnostic'

  get 'demo' => 'teachers/progress_reports/standards/classrooms#demo'

  patch 'verify_question' => 'chapter/practice#verify'
  get   'verify_question' => 'chapter/practice#verify_status'
  patch 'cheat'           => 'chapter/practice#cheat'
  get '/404' => 'errors#error_404'
  get '/500' => 'errors#error_500'

  root to: 'pages#home_new'

  # http://stackoverflow.com/questions/26130130/what-are-the-routes-i-need-to-set-up-to-preview-emails-using-rails-4-1-actionmai
  get '/lib/mailer_previews' => "rails/mailers#index"
  get '/lib/mailer_previews/*path' => "rails/mailers#preview"

  # catch-all 404
  get '*path', to: 'application#routing_error'

end
