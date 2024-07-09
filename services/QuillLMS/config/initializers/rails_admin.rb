# frozen_string_literal: true

RailsAdmin.config do |config|
  config.main_app_name = ['Quill Content Overview']

  config.asset_source = :sprockets

  config.authorize_with do |controller|
    current_user = User.find_by(id: session[:user_id])
    redirect_to main_app.root_path unless current_user&.staff?
  end

  UNEDITABLE_MODELS = ['ChangeLog'].freeze unless Object.const_defined?('UNEDITABLE_MODELS')

  config.actions do
    dashboard do
      statistics false
    end
    index                         # mandatory
    new
    export
    # Turn off bulk delete, seems dangerous
    # bulk_delete
    show
    edit do
      except UNEDITABLE_MODELS
    end
    delete do
      except UNEDITABLE_MODELS
    end
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  config.model 'ActivityCategory' do
    list do
      exclude_fields :activities, :activity_category_activities
    end
  end

  config.model 'Activity' do
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
    show do
      exclude_fields :teachers
    end
  end

  config.model 'ActivityClassification' do
    list do
      exclude_fields :activities
    end
  end

  config.model 'ActivityHealth' do
    list do
      exclude_fields :prompt_healths
    end
  end

  config.model 'AdminInfo' do
    list do
      exclude_fields :admin_approval_requests
    end
  end

  config.model 'AdminReportFilterSelection' do
    list do
      exclude_fields :pdf_subscriptions
    end
  end

  config.model 'AuthCredential' do
    list do
      limited_pagination true
    end
  end

  config.model 'BlogPost' do
    list do
      exclude_fields :blog_post_user_ratings
    end
  end

  config.model 'CanvasInstance' do
    list do
      field :id
      field :url
      field :created_at
      field :updated_at
    end

    show do
      exclude_fields :canvas_accounts, :canvas_instance_auth_credentials
    end
  end

  config.model 'ChangeLog' do
    # TODO: this is a workaround for a bug in changelog :user being overwritten
    field :user_name
    include_all_fields
    exclude_fields :user
  end

  config.model 'Classroom' do
    list do
      exclude_fields :classroom_units, :units, :unit_activities, :activities, :standard_levels,
        :coteacher_classroom_invitations, :students, :students_classrooms, :classrooms_teachers, :teachers
      limited_pagination true
    end
    edit do
      configure :teachers do
        read_only true
      end
      configure :students do
        read_only true
      end
    end
  end

  config.model 'Concept' do
    list do
      exclude_fields :change_logs
    end
  end

  config.model 'ContentPartner' do
    list do
      exclude_fields :activities, :content_partner_activities
    end
  end

  config.model 'District' do
    list do
      exclude_fields :schools
    end
  end

  config.model 'LearnWorldsAccount' do
    list do
      fields :id, :user, :last_login, :created_at, :updated_at
    end
  end

  config.model 'Milestone' do
    exclude_fields :users
  end

  config.model 'Objective' do
    exclude_fields :users, :checkboxes
  end

  config.model 'Recommendation' do
    list do
      exclude_fields :criteria
    end
  end

  config.model 'School' do
    list do
      field :zipcode do
        searchable true
      end
    end
  end

  config.model 'SchoolSubscription' do
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

  config.model 'SchoolsAdmins' do
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

  config.model 'Skill' do
    field :skill_concepts do
      eager_load skill_concepts: :concept
    end
    field :concepts do
      eager_load :concepts
    end
    include_all_fields
  end

  config.model 'SkillGroup' do
    object_label_method do
      :display_name_for_rails_admin
    end
  end

  config.model 'Standard' do
    list do
      exclude_fields :activities, :change_logs
    end
  end

  config.model 'StandardCategory' do
    list do
      exclude_fields :activities, :change_logs
      field :standards do
        eager_load :standards
      end
    end
  end

  config.model 'StandardLevel' do
    list do
      exclude_fields :activities, :change_logs
      field :standards do
        eager_load :standards
      end
    end
  end

  config.model 'SubjectArea' do
    list do
      exclude_fields :teacher_info_subject_areas
    end
  end

  config.model 'Subscription' do
    list do
      exclude_fields :credit_transactions, :district_subscriptions, :districts, :school_subscriptions, :schools, :user_subscriptions, :users
    end
  end

  config.model 'Topic' do
    list do
      exclude_fields :activities, :activity_topics, :change_logs
    end
  end

  config.model 'TeacherInfo' do
    list do
      exclude_fields :teacher_info_subject_areas, :subject_areas
    end
  end

  config.model 'Unit' do
    list do
      exclude_fields :activities, :standards
      configure :classrooms do
        eager_load true
      end
      limited_pagination true
    end
    edit do
      exclude_fields :user
    end
  end

  config.model 'UnitTemplate' do
    list do
      exclude_fields :activities, :activities_unit_templates, :partner_contents, :units, :recommendations, :diagnostics_recommended_by
    end
  end

  config.model 'UnitTemplateCategory' do
    list do
      exclude_fields :unit_templates
    end
  end

  config.model 'User' do
    list do
      field :name do
        searchable true
      end
      field :email do
        searchable true
      end
      field :password_digest do
        searchable false
      end
      field :created_at
      field :account_type
      field :role
      limited_pagination true
    end

    edit do
      field :name
      field :email
      field :username
    end
  end

  config.model 'UserSubscription' do
    field :user
    field :subscription do
      searchable [:id, :account_type]
    end
  end

  # Leaving in the models we turned off for documentation purposes
  # e.g. this model was turned off, not forgotten
  config.included_models = [
    # "ActiveActivitySession",
    'ActivitiesUnitTemplate',
    'Activity',
    'ActivityCategory',
    'ActivityCategoryActivity',
    'ActivityClassification',
    'ActivityHealth',
    # "ActivitySession",
    'ActivitySurveyResponse',
    'ActivityTopic',
    'AdminApprovalRequest',
    'AdminInfo',
    'AdminReportFilterSelection',
    'Announcement',
    'AppSetting',
    'AuthCredential',
    'Author',
    'BlogPost',
    'BlogPostUserRating',
    'CanvasAccount',
    # "CanvasConfig",
    'CanvasInstance',
    'CanvasInstanceAuthCredential',
    'CanvasInstanceSchool',
    'ChangeLog',
    'Checkbox',
    'Classroom',
    # "ClassroomActivity",
    # "ClassroomUnit",
    # "ClassroomUnitActivityState",
    # "ClassroomsTeacher",
    'Concept',
    'ConceptFeedback',
    # "ConceptResult",
    # "ConceptResultDirections",
    # "ConceptResultInstructions",
    # "ConceptResultPreviousFeedback",
    # "ConceptResultPrompt",
    # "ConceptResultQuestionType",
    'ContentPartner',
    'ContentPartnerActivity',
    'CoteacherClassroomInvitation',
    'CreditTransaction',
    'Criterion',
    'CsvExport',
    'DiagnosticQuestionSkill',
    'District',
    'DistrictAdmin',
    'DistrictSubscription',
    # "FeedbackHistory",
    # "FeedbackHistoryFlag",
    # "FeedbackHistoryRating",
    # "FeedbackSession",
    # "FirebaseApp",
    'Image',
    'Invitation',
    # "IpLocation",
    'LearnWorldsAccount',
    'LearnWorldsAccountCourseEvent',
    'LearnWorldsCourse',
    'Locker',
    'Milestone',
    'Objective',
    # "PackSequence",
    # "PackSequenceItem",
    'PartnerContent',
    'PdfSubscription',
    'Plan',
    'PromptHealth',
    'ProviderClassroom',
    'ProviderClassroomUser',
    'Question',
    'RawScore',
    'Recommendation',
    'ReferralsUser',
    'ReferrerUser',
    'SalesContact',
    'SalesFormSubmission',
    'SalesStage',
    'SalesStageType',
    'School',
    'SchoolSubscription',
    'SchoolsAdmins',
    'SchoolsUsers',
    'Skill',
    'SkillConcept',
    'SkillGroup',
    'SkillGroupActivity',
    'Standard',
    'StandardCategory',
    'StandardLevel',
    'StripeCheckoutSession',
    'StripeWebhookEvent',
    'StudentFeedbackResponse',
    'StudentProblemReport',
    # "StudentsClassrooms",
    'SubjectArea',
    'Subscription',
    'TeacherInfo',
    'TeacherInfoSubjectArea',
    'TeacherNotification',
    'TeacherNotificationSetting',
    # "TeacherSavedActivity",
    # "ThirdPartyUserId",
    'TitleCard',
    'Topic',
    'Unit',
    # "UnitActivity",
    'UnitTemplate',
    'UnitTemplateCategory',
    'User',
    # "UserActivityClassification",
    'UserEmailVerification',
    # "UserLogin",
    # "UserMilestone",
    # "UserPackSequenceItem",
    'UserSubscription',
    'ZipcodeInfo'
  ]
end

# Monkey patch for a known issue: RailsAdmin tries to parse search strings as JSON
# https://github.com/railsadminteam/rails_admin/issues/2502
class RailsAdmin::Config::Fields::Types::Json
  register_instance_option :formatted_value do
    if value.is_a?(Hash) || value.is_a?(Array)
      JSON.pretty_generate(value)
    else
      value
    end
  end

  def parse_value(value)
    value.present? ? JSON.parse(value) : nil
  rescue JSON::ParserError
    value
  end
end
