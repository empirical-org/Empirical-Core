class Activity < ActiveRecord::Base
  include Flags
  include Uid

  belongs_to :classification, class_name: 'ActivityClassification', foreign_key: 'activity_classification_id'
  belongs_to :topic

  has_one :section, through: :topic
  has_one :workbook, through: :section

  has_many :classroom_activities, dependent: :destroy
  has_many :classrooms, through: :classroom_activities

  scope :production, -> {
    where(<<-SQL, :production)
      activities.flags = '{}' OR ? = ANY (activities.flags)
    SQL
  }

  scope :with_classification, -> { includes(:classification).joins(:classification) }

  # filters = hash of model_name/model_id pairs
  # sort = hash with 'field' and 'asc_or_desc' (?) as keys
  def self.search(search_text, filters, sort)
    query = includes(:classification, :topic => [:section, :topic_category])
      .where("'production' = ANY(activities.flags)")
      .where("(activities.name ILIKE ?) OR (topic_categories.name ILIKE ?)", "%#{search_text}%", "%#{search_text}%")
      .where("topic_categories.id IS NOT NULL AND sections.id IS NOT NULL")
      .order(search_sort_sql(sort)).references(:topic)

    # Sorry for the meta-programming.
    filters.each do |model_name, model_id| # :activity_classifications, 123
      query = query.where("#{model_name}.id = ?", model_id)
    end

    query
  end

  def self.search_sort_sql(sort)
    return 'sections.name asc' if sort.blank?

    if sort['asc_or_desc'] == 'desc'
      order = 'desc'
    else
      order = 'asc'
    end

    case sort['field']
    when 'activity'
      field = 'activities.name'
    when 'activity_classification'
      field = 'activity_classifications.name'
    when 'section'
      field = 'sections.name'
    when 'topic_category'
      field = 'topic_categories.name'
    end

    field + ' ' + order
  end

  def classification_key= key
    self.classification = ActivityClassification.find_by_key(key)
  end

  def classification_key
    classification.try(:key)
  end

  def form_url
    url = Addressable::URI.parse(classification.form_url)

    if uid.present?
      params = (url.query_values || {})
      params[:uid] = uid
      url.query_values = params
    end

    url
  end

  def module_url(activity_session=nil, homepage=nil)
    url = Addressable::URI.parse(classification.module_url)

    params = (url.query_values || {})

    params[:uid] = uid if uid.present?

    if activity_session.present? && activity_session.is_a?(ActivitySession)
      params[:student] = activity_session.uid
      # params << ['access_token', activity_session.access_token]
    else
      params[:anonymous] = true
    end

    url.path = homepage_path(url.path, classification) if homepage.present?
    url.query_values = params

    fix_angular_fragment!(url)
  end

  # TODO cleanup
  def flag flag = nil
    return super(flag) unless flag.nil?
    flags.first
  end

  def flag= flag
    flag = :archived if flag.to_sym == :archive
    self.flags = [flag]
  end

  private

  def homepage_path(path, classification)
    case classification.app_name.to_sym
    when :grammar
      '/stories/homepage'
    when :writer
      '/'
    end
  end

  def fix_angular_fragment!(url)

    unless url.fragment.blank?
      url.path = "/##{url.fragment}"
      url.fragment = nil
    end

    return url
  end
end
