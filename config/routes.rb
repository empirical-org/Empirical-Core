Rails.application.routes.draw do
  mount ActionCable.server => '/admin_question'

  resources :responses
  get 'questions/:question_uid/responses' => 'responses#responses_for_question'
  post 'responses/create_or_increment'
  post 'responses/mass_edit/show_many' => 'responses#show_many'
  put 'responses/mass_edit/edit_many' => 'responses#edit_many'
  post 'responses/mass_edit/delete_many' => 'responses#delete_many'
  post 'questions/:question_uid/responses/search' => 'responses#search'
  post 'responses/batch_responses_for_lesson' => 'responses#batch_responses_for_lesson'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
