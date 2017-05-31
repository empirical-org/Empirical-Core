Rails.application.routes.draw do
  resources :responses
  get 'questions/:question_uid/responses' => 'responses#responses_for_question'
  put 'responses/:id/count' => 'responses#increment_count'
  put 'responses/:id/first_attempt_count' => 'responses#increment_first_attempt_count'
  put 'responses/:id/child_count' => 'responses#increment_child_count'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
