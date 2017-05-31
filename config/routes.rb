Rails.application.routes.draw do
  resources :responses
  get 'questions/:question_uid/responses' => 'responses#responses_for_question'
  put 'responses/:id/count' => 'responses#increment_counts'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
