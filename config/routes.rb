Rails.application.routes.draw do
  resources :responses
  get 'questions/:question_uid/responses' => 'responses#responses_for_question'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
