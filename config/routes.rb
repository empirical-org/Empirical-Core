EmpiricalGrammar::Application.routes.draw do
  resources :assessments
  resources :assignments
  resource :profile
  resources :password_reset

  resources :chapters, controller: 'chapter/start' do
    resources :practice, step: 'practice', controller: 'chapter/practice' do
      get ':question_index' => :show
    end

    resources :review, controller: 'practice', step: 'review', controller: 'chapter/practice' do
      get ':question_index' => :show
      get ':question_index/cheat' => :cheat
    end

    resource :story, controller: 'chapter/stories'
    get :final
    get :start
    get :resume
    get :retry
  end

  namespace :teachers do
    resources :classrooms do
      resources :chapters, controller: 'classroom_chapters'
      resources :students do
        put :reset_password
      end

      # TODO: abstract this list as well. Duplicated in nav in layout.
      %w(scorebook accounts import).each do |page|
        get page => "classroom_manager##{page}"
      end
    end
  end

  HoneyAuth::Routes.new(self).draw
  CMS::Routes.new(self).draw do
    resources :categories
    resources :rule_questions
    resources :chapters
    resources :rules
    resources :chapter_levels

    resources :users do
      member do
        put :sign_in
      end
    end
  end

  %w(middle_school story about learning develop mission faq tos lessons).each do |page|
    get page => "pages##{page}"
  end

  patch 'verify_question' => 'chapter/practice#verify'
  get   'verify_question' => 'chapter/practice#verify_status'
  patch 'cheat'           => 'chapter/practice#cheat'

  root to: 'pages#home'
end
