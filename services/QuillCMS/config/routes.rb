Rails.application.routes.draw do

  resources :responses
  get  'questions/:question_uid/responses' => 'responses#responses_for_question'
  get  'questions/:question_uid/health' => 'responses#get_health_of_question'
  get  'questions/:question_uid/grade_breakdown' => 'responses#get_grade_breakdown'
  post 'responses/create_or_increment'
  post 'responses/mass_edit/show_many' => 'responses#show_many'
  put  'responses/mass_edit/edit_many' => 'responses#edit_many'
  post 'responses/mass_edit/delete_many' => 'responses#delete_many'
  get  'responses/:question_uid/incorrect_sequences' => 'responses#get_incorrect_sequences'
  post  'responses/:question_uid/incorrect_sequence_affected_count' => 'responses#get_count_affected_by_incorrect_sequences'
  post  'responses/:question_uid/focus_point_affected_count' => 'responses#get_count_affected_by_focus_points'
  post 'questions/:question_uid/responses/search' => 'responses#search'
  post 'responses/batch_responses_for_lesson' => 'responses#batch_responses_for_lesson'
  post 'responses/clone_responses' => 'responses#clone_responses'

  # Stats controller
  get 'stats/question_health_index' => 'stats#question_health_index'
  get 'stats/diagnostic_question_health_index' => 'stats#diagnostic_question_health_index'

  #fragments controller for passing events to nlp.quill.org
  post 'fragments/is_sentence' => 'fragments#is_sentence'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
