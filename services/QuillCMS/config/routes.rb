require 'sidekiq/web'

Rails.application.routes.draw do
  get '/' => 'stats#up'

  put 'responses/replace_concept_uids' => 'responses#replace_concept_uids'

  resources :responses, only: [:show, :create, :update, :destroy]

  get  'questions/:question_uid/health' => 'responses#health_of_question'
  get  'questions/:question_uid/grade_breakdown' => 'responses#grade_breakdown'
  get  'questions/:question_uid/question_dashboard_data' => 'responses#question_dashboard'
  post 'responses/create_or_increment'
  post 'responses/create_or_update'
  post 'responses/mass_edit/show_many' => 'responses#show_many'
  put  'responses/mass_edit/edit_many' => 'responses#edit_many'
  post 'responses/mass_edit/delete_many' => 'responses#delete_many'
  get  'responses/:question_uid/incorrect_sequences' => 'responses#incorrect_sequences'
  post 'responses/:question_uid/incorrect_sequence_affected_count' => 'responses#count_affected_by_incorrect_sequences'
  post 'responses/:question_uid/focus_point_affected_count' => 'responses#count_affected_by_focus_points'
  post 'questions/:question_uid/responses/search' => 'responses#search'
  post 'responses/batch_responses_for_lesson' => 'responses#batch_responses_for_lesson'
  put  'question/:question_uid/reindex_responses_updated_today_for_given_question' => 'responses#reindex_responses_updated_today_for_given_question'
  post 'responses/clone_responses' => 'responses#clone_responses'
  post 'responses/rematch_all' => 'responses#rematch_all_responses_for_question'
  # Stats controller

  # Uptime status
  resource :status, only: [] do
    collection do
      get :index, :database, :redis_cache, :redis_queue, :elasticsearch
    end
  end

  resources :questions, only: [], param: :question_uid do
    get :responses, :multiple_choice_options, on: :member
  end

  # Sidekiq web interface
  mount Sidekiq::Web => '/sidekiq'

  #fragments controller for passing events to nlp.quill.org
  post 'fragments/is_sentence' => 'fragments#is_sentence'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # catch-all 404
  # DO NOT PLACE ROUTES BELOW THESE, these catch-alls must be last
  get '*path', to: 'application#routing_error'
  post '/', to: 'application#routing_error'
  post '*path', to: 'application#routing_error'

end
