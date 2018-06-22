Rails.application.routes.draw do
  resources :response_labels
  resources :activities, shallow: true do
    resources :question_sets
    resources :vocabulary_words
  end
  resources :question_sets, only: [], shallow: true do
    resources :questions
  end
  resources :questions, only: [], shallow: true do
    resources :responses
  end
  
  
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/', to: 'pages#index'

end
