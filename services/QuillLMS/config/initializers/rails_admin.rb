# frozen_string_literal: true

RailsAdmin.config do |config|
  ### Popular gems integration

  # # == Devise ==
  # config.authenticate_with do
  #   warden.authenticate! scope: :user
  # end
  # config.current_user_method(&:current_user)

  # == Cancan ==
  # config.authorize_with :cancan, Ability

  ## == Pundit ==
  # config.authorize_with :pundit

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  def current_user
    begin
      if session[:user_id]
        @current_user ||= User.find(session[:user_id])
      elsif doorkeeper_token
        User.find_by_id(doorkeeper_token.resource_owner_id)
      else
        authenticate_with_http_basic do |username, password|
          return @current_user ||= User.find_by_token!(username) if username.present?
        end
      end
    rescue ActiveRecord::RecordNotFound
      sign_out
      nil
    end
  end


  config.authorize_with do |controller|
    redirect_to main_app.root_path unless current_user.try(:staff?)
  end

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  config.actions do
    dashboard do
      statistics false
    end
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  config.model Concept do
    configure :concept_results do
      hide
      # for list view
      filterable false
      searchable false
    end

    # rest of your ParentModel configuration
  end
  config.model User do
    list do
      field :password_digest do
        searchable false
      end
      field :name do
        searchable true
      end
      field :email do
        searchable true
        # TODO: get this displaying emails
        # formatted_value do # used in form views
        #
        #   bindings[:object].email
        # end
        # pretty_value do # used in list view columns and show views, defaults to formatted_value for non-association fields
        #   bindings[:object].email
        # end
      end
      limited_pagination true
    end
  end

  config.model School do
    list do
      field :zipcode do
        searchable true
      end
      # field :name do
      #   searchable true
      # end
    end
  end

  config.model UserSubscription do
    field :user do
      # searchable [:email, :username]
      # filterable false
    end
    field :subscription do
      searchable [:id, :account_type]
    end
  end

  config.model SchoolSubscription do
    field :school do
      searchable [:name, :zipcode]
      proc { |scope|
        scope = scope.where(role: ['teacher','admin'])
      }
    end
    field :subscription do
      searchable [:id, :account_type]
    end
  end

  config.model SchoolsAdmins do
    field :user do
      searchable [:email, :username]
      sortable :email
      proc { |scope|
        scope = scope.where(role: ['teacher','admin'])
      }
    end
    field :school do
      searchable [:name, :zipcode]
      proc { |scope|
        scope = scope.where(role: ['teacher','admin'])
      }
    end
  end

  config.model Activity do
    edit do
      exclude_fields :classroom_units, :classrooms, :unit_activities, :units
    end
    list do
      field :id
      field :name do
        searchable true
      end
      field :classification
      field :flags
    end
  end

  # Limit pagination for models with large datasets (~1M+) because of performance
  config.model ClassroomActivity do
    list { limited_pagination true }
  end
  config.model UnitActivity do
    list { limited_pagination true }
  end
  config.model ClassroomUnit do
    list { limited_pagination true }
  end


  # Exclude the models with huge datasets (~10M+) because they are performance hits
  MODELS_TO_EXCLUDE = [
    'ActivitySession',
    'OldConceptResult',
    'Notification',
    'OauthAccessToken',
    'OldActivitySession',
    'StudentClassroom'
  ]

  config.excluded_models.push(*MODELS_TO_EXCLUDE)
end
