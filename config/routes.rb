require 'sidekiq/web'
require 'staff_constraint'

EmpiricalGrammar::Application.routes.draw do


  mount RailsAdmin::Engine => '/staff', as: 'rails_admin'
  use_doorkeeper

  mount Sidekiq::Web => '/sidekiq', constraints: StaffConstraint.new

  if Rails.env.test? || Rails.env == 'cypress'
    resources :factories, only: :create do
      post 'create_list', on: :collection
      delete 'destroy_all', on: :collection
    end
  end

  get '/classrooms/:classroom', to: 'students#index'
  get '/add_classroom', to: 'students#index'

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

  resources :blog_posts, path: 'teacher-center', only: [:index, :show], param: :slug do
    collection do
      get '/topic/:topic', to: 'blog_posts#show_topic'
      get 'search', to: 'blog_posts#search'
    end
  end

  resources :blog_posts, path: 'teacher_resources', only: [], param: :slug do
    collection do
      get '/', to: redirect('teacher-center')
      get '/:slug', to: redirect('teacher-center/%{slug}')
      get '/topic/:topic', to: redirect('teacher-center/topic/%{topic}')
      get 'search', to: redirect('teacher-center/search')
    end
  end

  post 'rate_blog_post', to: 'blog_post_user_ratings#create'


  # for Stripe
  resources :charges, only: [:create]
  post 'charges/update_card' => 'charges#update_card'
  post 'charges/create_customer_with_card' => 'charges#create_customer_with_card'
  post 'charges/new_teacher_premium' => 'charges#new_teacher_premium'
  post 'charges/new_school_premium' => 'charges#new_school_premium'
  put 'credit_transactions/redeem_credits_for_premium' => 'credit_transactions#redeem_credits_for_premium'

  resources :subscriptions do
    member do
      get :purchaser_name
    end
  end
  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset
  resources :schools, only: [:index], format: 'json'
  resources :students_classrooms do
    collection do
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

  resources :milestones, only: [] do
    get :has_viewed_lesson_tutorial, on: :collection
    post :complete_view_lesson_tutorial, on: :collection
  end

  resources :grades, only: [:index]

  get 'grades/tooltip/classroom_activity_id/:classroom_activity_id/user_id/:user_id/completed/:completed' => 'grades#tooltip'

  get :current_user_json, controller: 'teachers', action: 'current_user_json'

  get 'account_settings' => 'students#account_settings'
  put 'make_teacher' => 'students#make_teacher'
  get 'teachers/admin_dashboard' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_activity_scores' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_activity_scores/student_overview' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_concept_reports' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_standards_reports' => 'teachers#admin_dashboard'
  put 'teachers/update_current_user' => 'teachers#update_current_user'
  get 'teachers/:id/schools/:school_id' => 'teachers#add_school'
  get 'teachers/get_completed_diagnostic_unit_info' => 'teachers#get_completed_diagnostic_unit_info'
  get 'teachers/get_diagnostic_info_for_dashboard_mini' => 'teachers#get_diagnostic_info_for_dashboard_mini'
  get 'teachers/classrooms_i_teach_with_students' => 'teachers#classrooms_i_teach_with_students'
  get 'teachers/classrooms_i_own_with_students' => 'teachers#classrooms_i_own_with_students'
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
    get 'units/select_lesson/:activity_id' => 'units#select_lesson_with_activity_id'
    get 'units/lesson_info_for_activity/:activity_id' => 'units#lesson_info_for_activity'


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
        get 'lessons_units_and_activities'
        put 'update_multiple_due_dates'
        put ':id/hide' => 'classroom_activities#hide'
        get ':id/activity_from_classroom_activity' => 'classroom_activities#activity_from_classroom_activity'
        get ':id/launch_lesson/:lesson_uid' => 'classroom_activities#launch_lesson'
        get ':id/mark_lesson_as_completed/:lesson_uid' => 'classroom_activities#mark_lesson_as_completed'
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
    get 'progress_reports/activities_scores_by_classroom' => 'progress_reports#activities_scores_by_classroom'
    # in actual use with progress_reports/student_overview, pass the query string ?classroom_id=x&student_id=y
    get 'progress_reports/student_overview' => 'progress_reports#student_overview'

    namespace :progress_reports do
      resources :activity_sessions, only: [:index]
      resources :csv_exports, only: [:create]
      get 'report_from_classroom_activity_and_user/ca/:classroom_activity_id/user/:user_id' => 'diagnostic_reports#report_from_classroom_activity_and_user'
      get 'report_from_classroom_activity/:classroom_activity_id' => 'diagnostic_reports#report_from_classroom_activity'
      get 'diagnostic_reports' => 'diagnostic_reports#show'
      get 'diagnostic_status' => 'diagnostic_reports#diagnostic_status'
      get 'diagnostic_report' => 'diagnostic_reports#default_diagnostic_report'
      get 'question_view/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#question_view'
      get 'classrooms_with_students/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#classrooms_with_students'
      get 'students_by_classroom/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#students_by_classroom'
      get 'recommendations_for_classroom/:unit_id/:classroom_id/activity/:activity_id' => 'diagnostic_reports#recommendations_for_classroom'
      get 'lesson_recommendations_for_classroom/u/:unit_id/c/:classroom_id/a/:activity_id' => 'diagnostic_reports#lesson_recommendations_for_classroom'
      get 'previously_assigned_recommendations/:classroom_id/activity/:activity_id' => 'diagnostic_reports#previously_assigned_recommendations'
      get 'report_from_unit_and_activity/u/:unit_id/a/:activity_id' => 'diagnostic_reports#redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit'
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
        get :retrieve_classrooms_i_teach_for_custom_assigning_activities, controller: 'classroom_manager', action: 'retrieve_classrooms_i_teach_for_custom_assigning_activities'
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
        get :units
        get :hide #I am not sure why, however the first hide request on a classroom is always a get. Subsequent ones are put.
        post :hide
        get  :students_list, controller: 'classroom_manager', action: 'students_list'
        post :transfer_ownership
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

  resources :invitations, only: [] do
    collection do
      post :create_coteacher_invitation
      delete :destroy_pending_invitations_to_specific_invitee
      delete :destroy_pending_invitations_from_specific_inviter
    end
  end

  resources :classrooms_teachers, only: [] do
    get 'edit_coteacher_form', to: 'classrooms_teachers#edit_coteacher_form'
    post 'edit_coteacher_form', to: 'classrooms_teachers#update_coteachers'
  end
  get '/classrooms_teachers/specific_coteacher_info/:coteacher_id', to: 'classrooms_teachers#specific_coteacher_info'
  delete '/classrooms_teachers/destroy/:classroom_id', to: 'classrooms_teachers#destroy'



  resources :coteacher_classroom_invitations, only: [] do
    collection do
      post :accept_pending_coteacher_invitations, format: 'json'
      get :accept_pending_coteacher_invitations

      post :reject_pending_coteacher_invitations, format: 'json'
      get :reject_pending_coteacher_invitations
    end
  end

  # API routes
  namespace :api do
    namespace :v1 do
      get 'activities/uids_and_flags' => 'activities#uids_and_flags'
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
      post 'firebase_tokens/create_for_connect' => 'firebase_tokens#create_for_connect'
      resource :firebase_tokens,          only: [:create]
      get 'activities/:id/follow_up_activity_name_and_supporting_info' => 'activities#follow_up_activity_name_and_supporting_info'
      get 'activities/:id/supporting_info' => 'activities#supporting_info'
      get 'classroom_activities/:id/student_names' => 'classroom_activities#student_names'
      put 'classroom_activities/:id/finish_lesson' => 'classroom_activities#finish_lesson'
      put 'classroom_activities/:id/pin_activity' => 'classroom_activities#pin_activity'
      put 'classroom_activities/:id/unpin_and_lock_activity' => 'classroom_activities#unpin_and_lock_activity'
      get 'classroom_activities/:id/teacher_and_classroom_name' => 'classroom_activities#teacher_and_classroom_name'
      get 'classroom_activities/:id/classroom_teacher_and_coteacher_ids' => 'classroom_activities#classroom_teacher_and_coteacher_ids'
      get 'users/profile', to: 'users#profile'
      get 'users/current_user_and_coteachers', to: 'users#current_user_and_coteachers'
      post 'published_edition' => 'activities#published_edition'
      get 'progress_reports/activities_scores_by_classroom_data' => 'progress_reports#activities_scores_by_classroom_data'
      get 'progress_reports/district_activity_scores' => 'progress_reports#district_activity_scores'
      get 'progress_reports/district_concept_reports' => 'progress_reports#district_concept_reports'
      get 'progress_reports/district_standards_reports' => 'progress_reports#district_standards_reports'
      get 'progress_reports/student_overview_data/:student_id/:classroom_id' => 'progress_reports#student_overview_data'
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
  post '/session/login_through_ajax', to: 'sessions#login_through_ajax'
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
  get '/clever/no_classroom', to: 'clever#no_classroom'
  get '/auth/failure', to: 'sessions#failure'

  put '/select_school', to: 'schools#select_school'
  get '/select_school', to: 'schools#select_school'

  namespace :cms do
    resources :images, only: [:index, :destroy, :create]
    put '/activity_categories/update_order_numbers', to: 'activity_categories#update_order_numbers'
    post '/activity_categories/destroy_and_recreate_acas', to: 'activity_categories#destroy_and_recreate_acas'
    resources :activity_categories, only: [:index, :show, :create, :update, :destroy]
    resources :admin_accounts, only: [:index, :create, :update, :destroy]
    resources :admins, only: [:index, :create, :update, :destroy]
    resources :categories
    resources :concepts
    resources :sections
    put '/activity_classifications/update_order_numbers', to: 'activity_classifications#update_order_numbers'
    resources :activity_classifications
    resources :topics
    resources :subscriptions
    resources :topic_categories
    resources :authors, only: [:index, :create, :edit, :update, :new]
    put '/unit_templates/update_order_numbers', to: 'unit_templates#update_order_numbers'
    resources :unit_templates, only: [:index, :create, :update, :destroy]
    resources :unit_template_categories, only: [:index, :create, :update, :destroy]
    put '/blog_posts/update_order_numbers', to: 'blog_posts#update_order_numbers'
    resources :blog_posts
    get '/blog_posts/:id/delete', to: 'blog_posts#destroy'
    get '/blog_posts/:id/unpublish', to: 'blog_posts#unpublish'
    resources :activities, path: 'activity_type/:activity_classification_id/activities' do
      resource :data
    end

    resources :users do
      # resource :subscription
      collection do
        get 'new_with_school/:school_id', to: 'users#new_with_school', as: :new_with_school
        post 'create_with_school/:school_id', to: 'users#create_with_school', as: :create_with_school
        post :search
        get :search, to: 'users#index'
      end
      member do
        get :show_json
        put :sign_in
        put :clear_data
        get :sign_in
        get :edit_subscription
        get :new_subscription
        post :complete_sales_stage
      end
      put 'make_admin/:school_id', to: 'users#make_admin', as: :make_admin
      put 'remove_admin/:school_id', to: 'users#remove_admin', as: :remove_admin
    end

    resources :schools do
      collection do
        post :search
        get :search, to: 'schools#index'
      end
      member do
        get :edit_subscription
        get :new_subscription
        get :new_admin
        post :add_admin_by_email
      end
    end

    resources :announcements, only: [:index, :new, :create, :update, :edit]
  end

  other_pages = %w(beta ideas board press partners develop mission faq tos privacy activities impact stats team premium media_kit play news home_new map firewall_info announcements)
  all_pages = other_pages
  all_pages.each do |page|
    get page => "pages##{page}", as: "#{page}"
  end

  # These are legacy routes that we are redirecting for posterity.
  get 'blog_posts', to: redirect('/news')
  get 'supporters', to: redirect('https://community.quill.org/')
  get 'story', to: redirect('/mission')
  get 'learning', to: redirect('https://support.quill.org/research-and-pedagogy')
  get 'new', to: redirect('/')
  get 'media', to: redirect('/media_kit')
  # End legacy route redirects.

  tools = %w(diagnostic_tool connect_tool grammar_tool proofreader_tool lessons_tool)
  tools.each do |tool|
    get "tools/#{tool.chomp('_tool')}" => "pages##{tool}"
  end

  tutorials = %w(lessons)
  tutorials.each do |tool|
    get "tutorials/#{tool}" => "pages#tutorials"
    get "tutorials/#{tool}/:slide_number" => "pages#tutorials"
  end

  get 'teacher_fix' => 'teacher_fix#index'
  get 'teacher_fix/unarchive_units' => 'teacher_fix#index'
  get 'teacher_fix/merge_student_accounts' => 'teacher_fix#index'
  get 'teacher_fix/merge_teacher_accounts' => 'teacher_fix#index'
  get 'teacher_fix/recover_classroom_activities' => 'teacher_fix#index'
  get 'teacher_fix/recover_activity_sessions' => 'teacher_fix#index'
  get 'teacher_fix/move_student' => 'teacher_fix#index'
  get 'teacher_fix/google_unsync' => 'teacher_fix#index'
  get 'teacher_fix/merge_two_schools' => 'teacher_fix#index'
  get 'teacher_fix/merge_two_classrooms' => 'teacher_fix#index'
  get 'teacher_fix/delete_last_activity_session' => 'teacher_fix#index'
  get 'teacher_fix/get_archived_units' => 'teacher_fix#get_archived_units'
  post 'teacher_fix/recover_classroom_activities' => 'teacher_fix#recover_classroom_activities'
  post 'teacher_fix/recover_activity_sessions' => 'teacher_fix#recover_activity_sessions'
  post 'teacher_fix/unarchive_units' => 'teacher_fix#unarchive_units'
  post 'teacher_fix/merge_student_accounts' => 'teacher_fix#merge_student_accounts'
  post 'teacher_fix/merge_teacher_accounts' => 'teacher_fix#merge_teacher_accounts'
  post 'teacher_fix/move_student_from_one_class_to_another' => 'teacher_fix#move_student_from_one_class_to_another'
  put 'teacher_fix/google_unsync_account' => 'teacher_fix#google_unsync_account'
  post 'teacher_fix/merge_two_schools' => 'teacher_fix#merge_two_schools'
  post 'teacher_fix/merge_two_classrooms' => 'teacher_fix#merge_two_classrooms'
  post 'teacher_fix/delete_last_activity_session' => 'teacher_fix#delete_last_activity_session'

  get 'activities/section/:section_id' => 'pages#activities', as: "activities_section"
  get 'activities/packs' => 'teachers/unit_templates#index'
  get 'activities/packs/diagnostic', to: redirect('/tools/diagnostic')
  get 'activities/packs/:id' => 'teachers/unit_templates#index'
  get 'activities/packs/category/:category' => 'teachers/unit_templates#index'
  get 'activities/packs/grade/:grade' => 'teachers/unit_templates#index'

  get 'teachers/classrooms/activity_planner/:tab' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/lessons/:classroom_id' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/lessons_for_activity/:activity_id' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/students/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit/:unitName' => 'teachers/classroom_manager#lesson_planner', :constraints => { :unitName => /[^\/]+/ }

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
  get 'customize/:id' => 'activities#customize_lesson'
  get 'preview_lesson/:lesson_id' => 'activities#preview_lesson'
  get 'activities/:id/supporting_info' => 'activities#supporting_info'

  get 'demo' => 'teachers/progress_reports/standards/classrooms#demo'
  get 'student_demo' => 'students#student_demo'
  get 'admin_demo', to: 'teachers/progress_reports#admin_demo'

  get '/404' => 'errors#error_404'
  get '/500' => 'errors#error_500'

  root to: 'pages#home_new'

  # http://stackoverflow.com/questions/26130130/what-are-the-routes-i-need-to-set-up-to-preview-emails-using-rails-4-1-actionmai
  get '/lib/mailer_previews' => "rails/mailers#index"
  get '/lib/mailer_previews/*path' => "rails/mailers#preview"

  get "/donate" => redirect("https://community.quill.org/donate")
  # catch-all 404
  get '*path', to: 'application#routing_error'



end
