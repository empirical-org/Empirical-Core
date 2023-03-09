# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/pro/web'
require 'staff_constraint'

EmpiricalGrammar::Application.routes.draw do

  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"

  mount RailsAdmin::Engine => '/staff', as: 'rails_admin'
  use_doorkeeper

  mount Sidekiq::Web => '/sidekiq', constraints: StaffConstraint.new

  get '/classrooms/:classroom', to: 'students#index', as: :classroom
  get '/add_classroom', to: 'students#index'
  get '/study', to: "students#index"
  get '/classes', to: "students#index"

  get '/school_for_current_user', to: 'schools_users#school_for_current_user'

  resources :admins, only: [:show], format: 'json' do
    member do
      get :admin_info
    end
  end

  # for admins to sign in as teachers
  resources :users do
    member do
      post :admin_resend_login_details, to: 'admins#resend_login_details'
      post :admin_remove_as_admin, to: 'admins#remove_as_admin'
      post :admin_make_admin, to: 'admins#make_admin'
      post :admin_unlink_from_school, to: 'admins#unlink_from_school'
      get :admin_sign_in_classroom_manager, to: 'admins#sign_in_classroom_manager'
      get :admin_sign_in_progress_reports, to: 'admins#sign_in_progress_reports'
      get :admin_sign_in_account_settings, to: 'admins#sign_in_account_settings'
    end
  end

  post 'admins/:id/create_and_link_accounts', to: 'admins#create_and_link_accounts'

  get '/sitemap.xml', to: redirect("https://quill-cdn.s3.amazonaws.com/documents/quill_sitemap.xml")

  # this blog post needs to be redirected
  get '/teacher-center/4-tips-to-maximize-remote-learning-with-quill' => redirect('teacher-center/teacher-toolbox-setting-up-remote-routines-with-quill')

  resources :blog_posts, path: 'teacher-center', only: [:index, :show], param: :slug do
    collection do
      get '/topic/press', to: redirect('/press')
      get '/topic/announcements', to: redirect('/announcements')
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

  resources :blog_posts, path: 'student-center', only: [], param: :slug do
    collection do
      get '/', to: 'blog_posts#student_center_index'
      get '/:slug', to: 'blog_posts#show'
      get '/topic/:topic', to: 'blog_posts#show_topic'
      get 'search', to: 'blog_posts#search'
    end
  end

  post 'rate_blog_post', to: 'blog_post_user_ratings#create'
  get 'featured_blog_post/:id', to: 'blog_posts#featured_blog_post'

  resources :student_feedback_responses, only: [:create]

  namespace :stripe_integration do
    post '/subscription_checkout_sessions', to: 'subscription_checkout_sessions#create'
    post '/subscription_payment_methods', to: 'subscription_payment_methods#create'
    post '/subscription_renewals', to: 'subscription_renewals#create'
    post '/webhooks', to: 'webhooks#create'
  end

  namespace :intercom_integration do
    post '/webhooks', to: 'webhooks#create'
  end

  namespace :ortto_integration do
    post '/webhooks', to: 'webhooks#create'
  end

  get 'subscriptions/retrieve_stripe_subscription/:stripe_invoice_id',
    to: 'subscriptions#retrieve_stripe_subscription',
    stripe_invoice_id: /in_[A-Za-z0-9]{8,}/

  put 'credit_transactions/redeem_credits_for_premium' => 'credit_transactions#redeem_credits_for_premium'

  resources :subscriptions do
    collection do
      get :school_admin_subscriptions
    end
    member do
      get :purchaser_name
    end
  end

  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset
  resources :verify_emails, only: [] do
    post :verify_by_staff, on: :collection, format: :json
    put :resend_verification_email, on: :collection, format: :json
    put :verify_by_token, on: :collection, format: :json
  end
  resources :schools, only: [:index], format: 'json'
  resources :students_classrooms, only: :create do
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
  get 'activity_sessions/classroom_units/:classroom_unit_id/activities/:activity_id' => 'activity_sessions#activity_session_from_classroom_unit_and_activity',
    as: :activity_session_from_classroom_unit_and_activity

  get 'classroom_units/:classroom_unit_id/activities/:id' => 'activities#activity_session'
  get 'activity_sessions/:uid' => 'activity_sessions#result'

  get 'students_classrooms_json' => 'profiles#students_classrooms_json'
  get 'student_profile_data' => 'profiles#student_profile_data'
  get 'student_mobile_profile_data/:current_classroom_id' => 'profiles#mobile_profile_data'

  resources :activities, only: [] do
    post :retry, on: :member
    get :search, on: :collection
    get :index_with_unit_templates, on: :collection
    get :suggested_activities, on: :collection
  end

  resources :milestones, only: [] do
    get :has_viewed_lesson_tutorial, on: :collection
    post :complete_view_lesson_tutorial, on: :collection
    post :complete_acknowledge_lessons_banner, on: :collection
    post :complete_acknowledge_diagnostic_banner, on: :collection
    post :complete_acknowledge_evidence_banner, on: :collection
    post :complete_acknowledge_growth_diagnostic_promotion_card, on: :collection
    post :complete_dismiss_grade_level_warning, on: :collection
    post :complete_dismiss_school_selection_reminder, on: :collection
    post :create_or_touch_dismiss_teacher_info_modal, on: :collection
  end

  resources :grades, only: [:index]

  resources :teacher_saved_activities, only: [] do
    get :saved_activity_ids_for_current_user, on: :collection
    post :create_by_activity_id_for_current_user, on: :collection
    delete :destroy_by_activity_id_for_current_user, on: :collection
  end

  resources :teacher_infos, only: [:create] do
    put :update, on: :collection
  end

  resources :admin_infos, only: [] do
    put :update, on: :collection
  end

  get 'grades/tooltip/classroom_unit_id/:classroom_unit_id/user_id/:user_id/activity_id/:activity_id/completed/:completed' => 'grades#tooltip'

  get :current_user_json, controller: 'teachers', action: 'current_user_json'

  get 'account_settings' => 'students#account_settings'
  put 'students/update_account' => 'students#update_account'
  put 'students/update_password' => 'students#update_password'
  get 'join/:classcode' => 'students#join_classroom'
  get 'teachers/admin_dashboard' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/school_subscriptions' => 'teachers#admin_dashboard', as: :teacher_admin_subscriptions
  get 'teachers/admin_dashboard/district_activity_scores' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_activity_scores/student_overview' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_concept_reports' => 'teachers#admin_dashboard'
  get 'teachers/admin_dashboard/district_standards_reports' => 'teachers#admin_dashboard'
  post 'teachers/unlink/:teacher_id' => 'teachers#unlink'
  put 'teachers/update_current_user' => 'teachers#update_current_user'
  post 'teachers/unlink/:teacher_id' => 'teachers#unlink'
  get 'teachers/:id/schools/:school_id' => 'teachers#add_school'
  get 'teachers/completed_diagnostic_unit_info' => 'teachers#completed_diagnostic_unit_info'
  get 'teachers/diagnostic_info_for_dashboard_mini' => 'teachers#diagnostic_info_for_dashboard_mini'
  get 'teachers/lessons_info_for_dashboard_mini' => 'teachers#lessons_info_for_dashboard_mini'
  get 'teachers/classrooms_i_teach_with_students' => 'teachers#classrooms_i_teach_with_students'
  get 'teachers/classrooms_i_own_with_students' => 'teachers#classrooms_i_own_with_students'
  get 'teachers/classrooms_i_teach_with_lessons' => 'teachers#classrooms_i_teach_with_lessons'
  post 'teachers/classrooms/:class_id/unhide', controller: 'teachers/classrooms', action: 'unhide'
  post 'teachers/classrooms/bulk_archive', controller: 'teachers/classrooms', action: 'bulk_archive'
  get 'teachers/classrooms/:id/student_logins', only: [:pdf], controller: 'teachers/classrooms', action: 'generate_login_pdf', as: :generate_login_pdf, defaults: { format: 'pdf' }
  get :teacher_dashboard_metrics, controller: 'teachers/classroom_manager', action: 'teacher_dashboard_metrics'

  namespace :teachers do

    resources :units, as: 'units_path' do
      get :classrooms_with_students_and_classroom_units, on: :member
      put :update_classroom_unit_assigned_students, on: :member
      put :update_activities, on: :member
      # moved from within classroom, since units are now cross-classroom
    end

    get 'prohibited_unit_names' => 'units#prohibited_unit_names'
    get 'last_assigned_unit_id' => 'units#last_assigned_unit_id'
    get 'diagnostic_units' => 'units#diagnostic_units'
    get 'lesson_units' => 'units#lesson_units'
    get 'units/select_lesson/:activity_id' => 'units#select_lesson_with_activity_id'
    get 'units/lesson_info_for_activity/:activity_id' => 'units#lesson_info_for_activity'
    get 'units/score_info_for_activity/:activity_id' => 'units#score_info'

    resources :unit_templates, only: [:index] do
      collection do
        get :profile_info, controller: 'unit_templates', action: 'profile_info'
        get :assigned_info, controller: 'unit_templates', action: 'assigned_info'
        get :previously_assigned_activities, controller: 'unit_templates', action: 'previously_assigned_activities'
        post :fast_assign, controller: 'unit_templates', action: 'fast_assign'
      end
    end

    resources :classroom_activities, only: [:destroy, :update], as: 'classroom_activities_path' do
      collection do
        get '/:slug', to: redirect('teacher-center/%{slug}')
        get 'lessons_activities_cache', to: redirect('teachers/classroom_units/lesson_activities_cache')
        get 'lessons_units_and_activities', to: redirect('teachers/classroom_units/lessons_units_and_activities')
        put 'update_multiple_dates', to: redirect('teachers/unit_activities/update_multiple_dates')
        get ':id/post_to_google', to: redirect('teachers/classroom_units/%{id}/post_to_google')
        put ':id/hide', to: redirect('teachers/unit_activities/%{id}/hide')
        get ':id/launch_lesson/:lesson_uid', to: redirect('teachers/classroom_units/%{id}/launch_lesson/%{lesson_uid}')
        get ':id/mark_lesson_as_completed/:lesson_uid', to: redirect('teachers/classroom_units/%{id}/mark_lesson_as_completed/%{lesson_uid}')
      end
    end

    resources :classroom_units, only: [:destroy], as: 'classroom_units_path' do
      collection do
        get 'lessons_activities_cache'
        get 'lessons_units_and_activities'
        get ':id/post_to_google' => 'classroom_units#post_to_google'
        get ':id/launch_lesson/:lesson_uid' => 'classroom_units#launch_lesson'
        get ':id/mark_lesson_as_completed/:lesson_uid' => 'classroom_units#mark_lesson_as_completed'
      end
    end

    resources :unit_activities, only: [:destroy, :update], as: 'unit_activities_path' do
      collection do
        put 'update_multiple_dates'
        put ':id/hide' => 'unit_activities#hide'
      end
    end

    get 'activity_feed', to: 'classroom_manager#activity_feed'
    get 'unset_preview_as_student', to: 'classroom_manager#unset_preview_as_student'
    get 'preview_as_student/:student_id', to: 'classroom_manager#preview_as_student'
    get 'view_demo', to: 'classroom_manager#view_demo'
    get 'demo_id', to: 'classroom_manager#demo_id'
    get 'unset_view_demo', to: 'classroom_manager#unset_view_demo'
    get 'getting_started' => 'classroom_manager#getting_started'
    get 'add_students' => 'classroom_manager#generic_add_students'
    get 'teacher_guide' => 'classroom_manager#teacher_guide'
    get 'my_account' => 'classroom_manager#my_account'
    put 'update_my_account' => 'classroom_manager#update_my_account'
    put 'update_my_password' => 'classroom_manager#update_my_password'
    post 'clear_data/:id' => 'classroom_manager#clear_data'
    put 'units/:id/hide' => 'units#hide', as: 'hide_units_path'
    put 'units/:id/close' => 'units#close', as: 'close_units_path'
    put 'units/:id/open' => 'units#open', as: 'open_units_path'
    get 'progress_reports/landing_page' => 'progress_reports#landing_page'
    get 'progress_reports/activities_scores_by_classroom' => 'progress_reports#activities_scores_by_classroom'
    get 'progress_reports/real_time' => 'progress_reports#real_time'
    # in actual use with progress_reports/student_overview, pass the query string ?classroom_id=x&student_id=y
    get 'progress_reports/student_overview' => 'progress_reports#student_overview'

    namespace :progress_reports do
      resources :activity_sessions, only: [:index]
      resources :csv_exports, only: [:create]
      get 'report_from_classroom_unit_and_activity_and_user/cu/:classroom_unit_id/user/:user_id/a/:activity_id' => 'diagnostic_reports#report_from_classroom_unit_and_activity_and_user'
      get 'report_from_classroom_and_unit_and_activity_and_user/classroom/:classroom_id/unit/:unit_id/user/:user_id/activity/:activity_id' => 'diagnostic_reports#report_from_classroom_and_unit_and_activity_and_user'
      get 'report_from_classroom_unit_and_activity/:classroom_unit_id/a/:activity_id' => 'diagnostic_reports#report_from_classroom_unit_and_activity'
      get 'diagnostic_reports' => 'diagnostic_reports#show'
      get 'diagnostic_status' => 'diagnostic_reports#diagnostic_status'
      get 'diagnostic_report' => 'diagnostic_reports#default_diagnostic_report'
      get 'diagnostic_results_summary' => 'diagnostic_reports#diagnostic_results_summary'
      get 'diagnostic_growth_results_summary' => 'diagnostic_reports#diagnostic_growth_results_summary'
      get 'diagnostic_student_responses_index' => 'diagnostic_reports#diagnostic_student_responses_index'
      get 'individual_student_diagnostic_responses/:student_id' => 'diagnostic_reports#individual_student_diagnostic_responses'
      get 'question_view/classroom/:classroom_id/activity/:activity_id/unit/:unit_id' => 'diagnostic_reports#question_view'
      get 'question_view/classroom/:classroom_id/activity/:activity_id' => 'diagnostic_reports#question_view'
      get 'classrooms_with_students/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#classrooms_with_students'
      get 'students_by_classroom/u/:unit_id/a/:activity_id/c/:classroom_id' => 'diagnostic_reports#students_by_classroom'
      get 'recommendations_for_classroom/:classroom_id/activity/:activity_id' => 'diagnostic_reports#recommendations_for_classroom'
      get 'lesson_recommendations_for_classroom/:classroom_id/activity/:activity_id' => 'diagnostic_reports#lesson_recommendations_for_classroom'
      get 'skills_growth/:classroom_id/post_test_activity_id/:post_test_activity_id/pre_test_activity_id/:pre_test_activity_id' => 'diagnostic_reports#skills_growth'
      get 'diagnostic_activity_ids' => 'diagnostic_reports#diagnostic_activity_ids'
      get 'activity_with_recommendations_ids' => 'diagnostic_reports#activity_with_recommendations_ids'
      get 'previously_assigned_recommendations/:classroom_id/activity/:activity_id' => 'diagnostic_reports#previously_assigned_recommendations'
      get 'student_ids_for_previously_assigned_activity_pack/:classroom_id/activity_pack/:activity_pack_id' => 'diagnostic_reports#student_ids_for_previously_assigned_activity_pack'
      get 'report_from_unit_and_activity/u/:unit_id/a/:activity_id' => 'diagnostic_reports#redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit'
      post 'assign_independent_practice_packs' => 'diagnostic_reports#assign_independent_practice_packs'
      post 'assign_post_test' => 'diagnostic_reports#assign_post_test'
      post 'assign_whole_class_instruction_packs' => 'diagnostic_reports#assign_whole_class_instruction_packs'

      namespace :concepts do
        resources :students, only: [:index] do
          resources :concepts, only: [:index]
        end
      end

      namespace :standards do
        resources :classrooms, only: [:index] do
          resources :students, controller: "classroom_students", only: [:index] do
            resources :standards, controller: "student_standards", only: [:index]
          end

          resources :standards, controller: "classroom_standards", only: [:index] do
            resources :students, controller: "standard_students", only: [:index]
          end
        end
      end
    end

    resources :classrooms, only: [:index, :new, :create, :update, :destroy] do
      post :create_students
      post :remove_students

      put :import_google_students, controller: 'classroom_manager', action: 'import_google_students'

      collection do
        get :archived, action: 'index', as: :archived
        get :classrooms_i_teach
        get :regenerate_code
        get :archived_classroom_manager_data, controller: "classroom_manager", action: 'archived_classroom_manager_data'
        get :manage_archived_classrooms, controller: "classroom_manager", action: 'manage_archived_classrooms'
        get :lesson_planner, controller: "classroom_manager", action: 'lesson_planner', path: 'activity_planner'
        get 'lesson_planner', to: redirect { |params, request|
          "#{Rails.application.routes.url_helpers.lesson_planner_teachers_classrooms_path}?#{request.params.to_query}"
        }
        post :lesson_planner, controller: "classroom_manager", action: 'lesson_planner'
        get :scorebook, controller: 'classroom_manager', action: 'scorebook'
        get :scores, controller: 'classroom_manager', action: 'scores'
        get :dashboard, controller: 'classroom_manager', action: 'dashboard'
        get :retrieve_classrooms_for_assigning_activities, controller: 'classroom_manager', action: 'retrieve_classrooms_for_assigning_activities'
        get :retrieve_classrooms_i_teach_for_custom_assigning_activities, controller: 'classroom_manager', action: 'retrieve_classrooms_i_teach_for_custom_assigning_activities'
        get 'classrooms_and_classroom_units_for_activity_share/:unit_id' => 'classroom_manager#classrooms_and_classroom_units_for_activity_share'
        get :invite_students, controller: 'classroom_manager', action: 'invite_students'
        get :google_sync, controller: 'classroom_manager', action: 'google_sync'
        get :retrieve_google_classrooms, controller: 'classroom_manager', action: 'retrieve_google_classrooms'
        post :update_google_classrooms, controller: 'classroom_manager', action: 'update_google_classrooms'
        put :import_google_students, controller: 'classroom_manager', action: 'import_google_students'

        ##DASHBOARD ROUTES
        get :classroom_mini, controller: 'classroom_manager', action: 'classroom_mini'
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
        collection do
          post :merge_student_accounts
          post :move_students
        end
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
    post :remove_coteacher
  end
  get '/classrooms_teachers/specific_coteacher_info/:coteacher_id', to: 'classrooms_teachers#specific_coteacher_info'
  put '/classrooms_teachers/update_order' => 'classrooms_teachers#update_order'
  delete '/classrooms_teachers/destroy/:classroom_id', to: 'classrooms_teachers#destroy'

  put 'feedback_history_rating' => 'feedback_history_ratings#create_or_update'
  put 'feedback_history_rating/mass_mark' => 'feedback_history_ratings#mass_mark'

  resources :coteacher_classroom_invitations, only: [:destroy] do
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
      get 'activities/activities_health' => 'activities#activities_health'
      get 'activities/diagnostic_activities' => 'activities#diagnostic_activities'
      get 'rule_feedback_histories' => 'rule_feedback_histories#by_conjunction'
      get 'rule_feedback_history/:rule_uid' => 'rule_feedback_histories#rule_detail'
      get 'prompt_health' => 'rule_feedback_histories#prompt_health'
      get 'activity_health' => 'rule_feedback_histories#activity_health'
      post 'email_csv_data' => 'session_feedback_histories#email_csv_data'

      resources :activities,              except: [:index, :new, :edit]
      resources :activity_flags,          only: [:index]
      resources :activity_sessions,       except: [:index, :new, :edit]
      resources :feedback_histories,      only: [:index, :show, :create]
      resources :lessons_tokens,          only: [:create]
      resources :session_feedback_histories, only: [:index, :show]
      resources :standard_levels,                only: [:index]
      resources :standards,                  only: [:index]
      resources :standard_categories,        only: [:index]
      resources :concepts,                only: [:index, :create] do
        collection do
          get 'level_zero_concepts_with_lineage'
        end
      end

      resources :users, only: [:index]
      resources :app_settings, only: [:index, :show], param: :name do
        member do
          get :admin_show
        end
      end

      resources :classroom_units,         only: [] do
        collection do
          get 'student_names'
          put 'finish_lesson'
          put 'unpin_and_lock_activity'
          get 'teacher_and_classroom_name'
          get 'classroom_teacher_and_coteacher_ids'
        end
      end
      resource :me, controller: 'me',     except: [:index, :new, :edit, :destroy]
      resource :ping, controller: 'ping', except: [:index, :new, :edit, :destroy]
      post 'firebase_tokens/create_for_connect' => 'firebase_tokens#create_for_connect'
      resource :firebase_tokens,          only: [:create]
      resources :title_cards,             except: [:destroy]
      get 'activities/:id/follow_up_activity_name_and_supporting_info' => 'activities#follow_up_activity_name_and_supporting_info'
      get 'activities/:id/supporting_info' => 'activities#supporting_info'
      get 'activities/:id/question_health' => 'activities#question_health'
      get 'classroom_activities/student_names' => 'classroom_units#student_names'
      put 'classroom_activities/finish_lesson' => 'classroom_units#finish_lesson'
      put 'classroom_activities/unpin_and_lock_activity' => 'classroom_units#unpin_and_lock_activity'
      get 'classroom_activities/teacher_and_classroom_name' => 'classroom_units#teacher_and_classroom_name'
      get 'classroom_activities/classroom_teacher_and_coteacher_ids' => 'classroom_units#classroom_teacher_and_coteacher_ids'
      get 'users/profile', to: 'users#profile'
      get 'users/current_user_and_coteachers', to: 'users#current_user_and_coteachers'
      get 'users/current_user_role', to: 'users#current_user_role'
      get 'users/student_and_teacher_ids_for_session/:activity_session_uid', to: 'users#student_and_teacher_ids_for_session'
      post 'published_edition' => 'activities#published_edition'
      get 'progress_reports/activities_scores_by_classroom_data' => 'progress_reports#activities_scores_by_classroom_data'
      get 'progress_reports/district_activity_scores' => 'progress_reports#district_activity_scores'
      get 'progress_reports/district_concept_reports' => 'progress_reports#district_concept_reports'
      get 'progress_reports/district_standards_reports' => 'progress_reports#district_standards_reports'
      get 'progress_reports/student_overview_data/:student_id/:classroom_id' => 'progress_reports#student_overview_data'
      resources :lessons do
        member do
          put 'add_question'
        end
      end
      resources :shared_cache, only: [:show, :update, :destroy]
      scope 'activity_type/:activity_type' do
        resources :concept_feedback
      end

      resources :questions, except: [:destroy] do
        resources :focus_points do
          put :update_all, on: :collection
        end
        resources :incorrect_sequences do
          put :update_all, on: :collection
        end
        member do
          put 'update_flag'
          put 'update_model_concept'
        end
      end
      resources :active_activity_sessions, only: [:show, :update]
      resources :activity_survey_responses, only: [:create]
      resources :student_problem_reports, only: [:create]
      resources :lockers, only: [:show, :create, :update]

      mount Evidence::Engine => "/evidence", as: :evidence
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
  get '/finish_sign_up', to: 'sessions#finish_sign_up'
  post '/session/login_through_ajax', to: 'sessions#login_through_ajax'
  post '/session/set_post_auth_redirect', to: 'sessions#set_post_auth_redirect'
  resource :session

  resource :account, only: [:new, :create, :edit, :update, :show] do
    post :role, on: :member
  end

  get 'account/:token/finish_set_up', to: 'accounts#edit'
  put 'account/:token', to: 'accounts#update'

  get '/sign-up/verify-school', to: 'accounts#new'
  get '/sign-up/verify-email', to: 'accounts#new'
  get '/sign-up/select-sub-role', to: 'accounts#new'
  get '/sign-up/admin', to: 'accounts#new'
  get '/sign-up/teacher', to: 'accounts#new'
  get '/sign-up/student', to: 'accounts#new'
  get '/sign-up/individual-contributor', to: 'accounts#new'
  get '/sign-up/pick-school-type', to: 'accounts#new'
  get '/sign-up/add-k12', to: 'accounts#new'
  get '/sign-up/add-non-k12', to: 'accounts#new'
  get '/sign-up/add-teacher-info', to: 'accounts#new'

  get Auth::Google::OFFLINE_ACCESS_CALLBACK_PATH => 'auth/google#offline_access_callback'
  get Auth::Google::ONLINE_ACCESS_CALLBACK_PATH => 'auth/google#online_access_callback'

  namespace :auth do
    get '/clever/callback', to: 'clever#clever'
  end

  namespace :clever_integration do
    get '/teachers/retrieve_classrooms', to: 'teachers#retrieve_classrooms'
    post '/teachers/import_classrooms', to: 'teachers#import_classrooms'
    put '/teachers/import_students', to: 'teachers#import_students'
  end

  get '/clever/auth_url_details', to: 'clever#auth_url_details'
  get '/clever/no_classroom', to: 'clever#no_classroom'
  get '/auth/failure', to: 'sessions#failure'

  put '/select_school', to: 'schools#select_school'
  get '/select_school', to: 'schools#select_school'
  post '/submit_unlisted_school_information', to: 'schools#submit_unlisted_school_information'

  namespace :cms do
    resources :images, only: [:index, :destroy, :create]
    resources :csv_uploads, only: [:create]
    put '/activity_categories/mass_update', to: 'activity_categories#mass_update'
    resources :activity_categories, only: [:index, :create]
    resources :activity_classifications do
      put :update_order_numbers, on: :collection
      resources :activities do
        resource :data
        resources :recommendations do
          post :sort, on: :collection
          resources :criteria
        end
      end
    end
    resources :admin_accounts, only: [:index, :create, :update, :destroy]
    resources :admins, only: [:index, :create, :update, :destroy]
    resources :categories
    get '/concepts/concepts_in_use', to: 'concepts#concepts_in_use', only: [:csv], defaults: { format: 'csv' }
    resources :concepts
    resources :evidence, only: [:index]
    resources :rosters, only: [:index] do
      post :upload_teachers_and_students, on: :collection
    end
    resources :admin_verification, only: [:index] do
      put :set_approved, on: :collection
      put :set_denied, on: :collection
      put :set_pending, on: :collection
    end
    resources :standard_levels, only: [:index, :create, :update]
    resources :standards, only: [:index, :create, :update]
    resources :content_partners, only: [:index, :create, :update]
    resources :subscriptions
    resources :standard_categories, only: [:index, :create, :update]
    resources :authors, only: [:index, :create, :edit, :update, :new]
    put '/unit_templates/update_order_numbers', to: 'unit_templates#update_order_numbers'
    resources :unit_templates, only: [:index, :create, :edit, :new, :update, :destroy]
    resources :unit_template_categories, only: [:index, :edit, :create, :update, :destroy]
    put '/blog_posts/update_order_numbers', to: 'blog_posts#update_order_numbers'
    put '/blog_posts/update_featured_order_numbers', to: 'blog_posts#update_featured_order_numbers'
    resources :blog_posts
    get '/blog_posts/:id/delete', to: 'blog_posts#destroy'
    get '/blog_posts/:id/unpublish', to: 'blog_posts#unpublish'

    resources :users do
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
        get :new_subscription
        get :edit_subscription
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
        get :new_subscription
        get :edit_subscription
        get :new_admin
        get :add_existing_user
        post :add_admin_by_email
        post :add_existing_user_by_email
        post :unlink
      end
      resources :school_admins, only: [:create]
    end

    resources :districts do
      collection do
        post :search
        get :search, to: 'districts#index'
      end
      member do
        get :new_admin
        get :new_subscription
        get :edit_subscription
      end
      resources :district_admins, only: [:create, :destroy]
    end

    resources :announcements, only: [:index, :new, :create, :update, :edit]

    resources :topics, only: [:index, :update, :create]
    resources :raw_scores, only: [:index, :update, :create]
    resources :attributes_manager, only: [:index], as: 'attributes_manager'
    get 'attributes_manager/:attribute/:tab' => 'attributes_manager#index'
    get 'attributes_manager/:attribute' => 'attributes_manager#index'

  end

  resources :referrals, only: [:index] do
    collection do
      post :invite
    end
  end

  other_pages = %w(
    beta
    board
    press
    develop
    mission
    about
    faq
    tos
    privacy
    activities
    impact
    pathways
    stats
    team
    premium
    media_kit
    play
    news
    home_new
    map
    referrals_toc
    announcements
    backpack
    careers
    evidence
    proofreader
    grammar
    lessons
    diagnostic
    connect
    preap_units
    springboard_units
    administrator
    locker
  )

  all_pages = other_pages
  all_pages.each do |page|
    get page => "pages##{page}", as: page.to_s
  end

  # These are legacy routes that we are redirecting for posterity.
  get 'comprehension', to: redirect('evidence')
  get 'blog_posts', to: redirect('/news')
  get 'supporters', to: redirect('about')
  get 'story', to: redirect('/mission')
  get 'learning', to: redirect('https://support.quill.org/research-and-pedagogy')
  get 'new', to: redirect('/')
  get 'media', to: redirect('/media_kit')
  get 'board', to: redirect('/team')
  get 'partners', to: redirect('/about')
  # End legacy route redirects.

  tools = %w(diagnostic_tool connect_tool grammar_tool proofreader_tool lessons_tool evidence_tool)
  tools.each do |tool|
    get "tools/#{tool.chomp('_tool')}" => "pages##{tool}"
  end

  tutorials = %w(lessons)
  tutorials.each do |tool|
    get "tutorials/#{tool}" => "pages#tutorials"
    get "tutorials/#{tool}/:slide_number" => "pages#tutorials"
  end

  get 'premium/request-school-quote' => 'pages#request_school_quote'
  get 'premium/request-district-quote' => 'pages#request_district_quote'

  get 'teacher_fix' => 'teacher_fix#index'
  get 'teacher_fix/unarchive_units' => 'teacher_fix#index'
  get 'teacher_fix/merge_student_accounts' => 'teacher_fix#index'
  get 'teacher_fix/merge_teacher_accounts' => 'teacher_fix#index'
  get 'teacher_fix/recover_classroom_units' => 'teacher_fix#index'
  get 'teacher_fix/recover_unit_activities' => 'teacher_fix#index'
  get 'teacher_fix/recover_activity_sessions' => 'teacher_fix#index'
  get 'teacher_fix/move_student' => 'teacher_fix#index'
  get 'teacher_fix/google_unsync' => 'teacher_fix#index'
  get 'teacher_fix/merge_two_schools' => 'teacher_fix#index'
  get 'teacher_fix/merge_two_classrooms' => 'teacher_fix#index'
  get 'teacher_fix/merge_activity_packs' => 'teacher_fix#index'
  get 'teacher_fix/delete_last_activity_session' => 'teacher_fix#index'
  get 'teacher_fix/remove_unsynced_students' => 'teacher_fix#index'
  get 'teacher_fix/list_unsynced_students_by_classroom'
  get 'teacher_fix/archived_units' => 'teacher_fix#archived_units'
  get 'teacher_fix/recalculate_staggered_release_locks' => 'teacher_fix#index'
  post 'teacher_fix/recover_classroom_units' => 'teacher_fix#recover_classroom_units'
  post 'teacher_fix/recover_unit_activities' => 'teacher_fix#recover_unit_activities'
  post 'teacher_fix/recover_activity_sessions' => 'teacher_fix#recover_activity_sessions'
  post 'teacher_fix/unarchive_units' => 'teacher_fix#unarchive_units'
  post 'teacher_fix/merge_student_accounts' => 'teacher_fix#merge_student_accounts'
  post 'teacher_fix/merge_teacher_accounts' => 'teacher_fix#merge_teacher_accounts'
  post 'teacher_fix/move_student_from_one_class_to_another' => 'teacher_fix#move_student_from_one_class_to_another'
  put 'teacher_fix/google_unsync_account' => 'teacher_fix#google_unsync_account'
  post 'teacher_fix/merge_two_schools' => 'teacher_fix#merge_two_schools'
  post 'teacher_fix/merge_two_classrooms' => 'teacher_fix#merge_two_classrooms'
  post 'teacher_fix/merge_activity_packs' => 'teacher_fix#merge_activity_packs'
  post 'teacher_fix/delete_last_activity_session' => 'teacher_fix#delete_last_activity_session'
  post 'teacher_fix/remove_unsynced_students' => 'teacher_fix#remove_unsynced_students'
  post 'teacher_fix/recalculate_staggered_release_locks' => 'teacher_fix#recalculate_staggered_release_locks'

  get 'activities/section/:section_id', to: redirect('activities/standard_level/%{section_id}')
  get 'activities/standard_level/:standard_level_id' => 'pages#activities', as: "activities_section"
  get 'activities/packs' => 'teachers/unit_templates#index'
  get 'activities/packs/diagnostic', to: redirect('/tools/diagnostic')
  get 'activities/packs/:id' => 'teachers/unit_templates#index'
  get 'activities/packs/category/:category' => 'teachers/unit_templates#index'
  get 'activities/packs/grade/:grade' => 'teachers/unit_templates#index'

  get 'teachers/classrooms/activity_planner/assign-a-diagnostic' => redirect('/assign/diagnostic')
  get 'teachers/classrooms/activity_planner/:tab' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/lessons/:classroom_id' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/lessons_for_activity/:activity_id' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/students/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit' => 'teachers/classroom_manager#lesson_planner'
  get 'teachers/classrooms/activity_planner/units/:unitId/activities/edit/:unitName' => 'teachers/classroom_manager#lesson_planner', :constraints => { :unitName => %r{[^/]+} }

  get 'assign' => 'teachers/classroom_manager#assign', as: 'assign_path'
  get 'assign/assign-a-diagnostic' => redirect('/assign/diagnostic')
  get 'assign/create-unit' => redirect('/assign/activity-library')
  get 'assign/create-activity-pack' => redirect('/assign/activity-library')
  get 'assign/:tab' => 'teachers/classroom_manager#assign'
  get 'assign/featured-activity-packs/category/:category' => 'teachers/classroom_manager#assign'
  get 'assign/featured-activity-packs/grade/:grade' => 'teachers/classroom_manager#assign'
  get 'assign/featured-activity-packs/:activityPackId' => 'teachers/classroom_manager#assign'
  get 'assign/featured-activity-packs/:activityPackId/assigned' => 'teachers/classroom_manager#assign'
  get 'assign/new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray' => 'teachers/classroom_manager#assign'

  get 'teachers/classrooms/assign_activities' => redirect('/assign')
  get 'teachers/classrooms/assign_activities/:tab' => redirect('/assign/%{tab}')
  get 'teachers/classrooms/assign_activities/featured-activity-packs/category/:category' => redirect('/assign/featured-activity-packs/category/%{category}')
  get 'teachers/classrooms/assign_activities/featured-activity-packs/grade/:grade' => redirect('/assign/featured-activity-packs/grade/%{grade}')
  get 'teachers/classrooms/assign_activities/featured-activity-packs/:activityPackId' => redirect('/assign/featured-activity-packs/%{activityPackId}')
  get 'teachers/classrooms/assign_activities/featured-activity-packs/:activityPackId/assigned' => redirect('/assign/featured-activity-packs/%{activityPackId}/assigned')
  get 'teachers/classrooms/assign_activities/new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray' => redirect('/assign/new_unit/students/edit/name/%{unitName}/activity_ids/%{activityIdsArray}')

  # Sales forms routes
  get '/options_for_sales_form', to: 'sales_form_submission#options_for_sales_form'
  post '/submit_sales_form', to: 'sales_form_submission#create'

  # Integration routes (which should look pretty, and thus need some specifying)
  get 'amplify' => 'integrations#amplify'
  get 'amplify/all' => 'integrations#amplify_all'
  get 'amplify/section/:section_id', to: redirect('amplify/standard_level/%{section_id}')
  get 'amplify/standard_level/:standard_level_id' => 'integrations#amplify_all', as: "amplify_browse_section"


  # Count route to get quantities
  get 'count/featured_packs' => 'teachers/unit_templates#count'
  get 'count/activities' => 'activities#count'

  get 'lessons' => 'pages#activities' # so that old links still work
  get 'about' => 'pages#activities' # so that old links still work
  get 'diagnostic/:activityId' => redirect('/assign/diagnostic')
  get 'diagnostic/:activityId/stage/:stage' => redirect('/assign/diagnostic')
  get 'diagnostic/:activityId/success' => redirect('/assign/diagnostic')
  get 'customize/:id' => 'activities#customize_lesson'
  get 'preview_lesson/:lesson_id' => 'activities#preview_lesson'
  get 'activities/:id/supporting_info' => 'activities#supporting_info'
  get 'activities/:id/name_and_id' => 'activities#name_and_id'
  get 'activities/:id/last_unit_template' => 'activities#last_unit_template'

  # Uptime status
  resource :status, only: [] do
    collection do
      get :index, :database, :database_write, :database_follower, :redis_cache, :redis_queue, :sidekiq_queue_latency, :sidekiq_queue_length
      post :deployment_notification
    end
  end

  get 'demo' => 'teachers/progress_reports#demo'
  get 'quill_staff_demo' => 'teachers/progress_reports#staff_demo'
  get 'coach_demo' => 'teachers/progress_reports#coach_demo'
  get 'student_demo' => 'students#student_demo'
  get 'student_demo_ap' => 'students#demo_ap'
  get 'admin_demo', to: 'teachers/progress_reports#admin_demo'
  get 'preap' => 'pages#preap'
  get 'pre-ap', to: redirect('/preap')
  get 'pre-AP', to: redirect('/preap')
  get 'preAP', to: redirect('/preap')
  get 'ap' => 'pages#ap'
  get 'AP', to: redirect('/ap')
  get 'springboard' => 'pages#springboard'
  get 'request_quote' => 'sales_form_submission#request_quote'
  get 'request_renewal' => 'sales_form_submission#request_renewal'

  get '/404' => 'errors#error404'
  get '/500' => 'errors#error500'

  root to: 'pages#home_new'

  # http://stackoverflow.com/questions/26130130/what-are-the-routes-i-need-to-set-up-to-preview-emails-using-rails-4-1-actionmai
  get '/lib/mailer_previews' => "rails/mailers#index"
  get '/lib/mailer_previews/*path' => "rails/mailers#preview"

  get "/donate" => redirect("/about")
  # catch-all 404
  get '*path', to: 'application#routing_error'



end
