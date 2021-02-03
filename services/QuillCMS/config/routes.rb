require 'sidekiq/web'

Rails.application.routes.draw do
  get '/' => 'stats#up'

  resources :responses, only: [:show, :new, :create, :edit, :update, :destroy]
  get  'questions/:question_uid/responses' => 'responses#responses_for_question'
  get  'questions/:question_uid/multiple_choice_options' => 'responses#multiple_choice_options'
  get  'questions/:question_uid/health' => 'responses#health_of_question'
  get  'questions/:question_uid/grade_breakdown' => 'responses#grade_breakdown'
  post 'responses/create_or_increment'
  post 'responses/mass_edit/show_many' => 'responses#show_many'
  put  'responses/mass_edit/edit_many' => 'responses#edit_many'
  post 'responses/mass_edit/delete_many' => 'responses#delete_many'
  get  'responses/:question_uid/incorrect_sequences' => 'responses#incorrect_sequences'
  post  'responses/:question_uid/incorrect_sequence_affected_count' => 'responses#count_affected_by_incorrect_sequences'
  post  'responses/:question_uid/focus_point_affected_count' => 'responses#count_affected_by_focus_points'
  post 'questions/:question_uid/responses/search' => 'responses#search'
  post 'responses/batch_responses_for_lesson' => 'responses#batch_responses_for_lesson'
  put 'responses/replace_concept_uids' => 'responses#replace_concept_uids'
  put 'question/:question_uid/reindex_responses_updated_today_for_given_question' => 'responses#reindex_responses_updated_today_for_given_question'
  post 'responses/clone_responses' => 'responses#clone_responses'
  post 'responses/rematch_all' => 'responses#rematch_all_responses_for_question'
  # Stats controller

  # Uptime status
  resource :status, only: [] do
    collection do
      get :index, :database, :redis_cache, :redis_queue, :elasticsearch, :memcached
    end
  end

  # Sidekiq web interface
  mount Sidekiq::Web => '/sidekiq'

  #fragments controller for passing events to nlp.quill.org
  post 'fragments/is_sentence' => 'fragments#is_sentence'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # cron controller runs a job in the last hour of the day
  post 'cron' => 'cron#new'

end
