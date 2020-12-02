class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  belongs_to :author
  has_many :activities_unit_templates, -> { order('order_number ASC') }
  has_many :activities, through: :activities_unit_templates
  has_many :units
  has_many :partner_contents, dependent: :destroy, as: :content
  has_many :recommendations, dependent: :destroy
  serialize :grades, Array

  validates :flag,                  inclusion: { in: %w(archived alpha beta production private),
                                    message: "%<value>s is not a valid flag" }, :allow_nil => true


  scope :production, -> {where("unit_templates.flag IN('production') OR unit_templates.flag IS null")}
  scope :beta_user, -> { where("unit_templates.flag IN('production','beta') OR unit_templates.flag IS null")}
  scope :alpha_user, -> { where("unit_templates.flag IN('production','beta','alpha') OR unit_templates.flag IS null")}
  scope :private_user, -> { where("unit_templates.flag IN('private', 'production','beta','alpha') OR unit_templates.flag IS null")}
  around_save :delete_relevant_caches

  WHOLE_CLASS_AND_INDEPENDENT_PRACTICE = 'Whole class + Independent practice'
  INDEPENDENT_PRACTICE = 'Independent practice'
  DIAGNOSTIC = 'Diagnostic'

  def activity_ids= activity_ids
    # getting around rails defaulting to activities being set in order of the activity id rather than the selected order
    new_activities = activity_ids.map { |id| Activity.find(id) }
    self.activities = new_activities
  end

  def related_models(flag)
    UnitTemplate.user_scope(flag).where(unit_template_category_id: unit_template_category_id).where.not(id: id).limit(3)
  end

  def activity_ids
    activities.ids
  end

  def self.user_scope(user_flag)
    if user_flag == 'private'
      UnitTemplate.private_user
    elsif user_flag == 'alpha'
      UnitTemplate.alpha_user
    elsif user_flag == 'beta'
      UnitTemplate.beta_user
    else
      UnitTemplate.production
    end
  end

  def get_cached_serialized_unit_template(flag=nil)
    cache_expiration_time = 600
    cached = $redis.get("unit_template_id:#{id}_serialized")
    serialized_unit_template = cached.nil? || cached&.blank? ? nil : JSON.parse(cached)
    unless serialized_unit_template
      serializable_unit_template = UnitTemplatePseudoSerializer.new(self, flag)
      serialized_unit_template = serializable_unit_template.data
      $redis.set("unit_template_id:#{id}_serialized", serialized_unit_template.to_json, {ex: cache_expiration_time})
    end
    serialized_unit_template
  end

  def self.assign_to_whole_class(class_id, unit_template_id)
    assign_on_join = true
    student_ids = [] # student ids will be populated in the classroom activity assign_on_join callback
    argument_hash = {
      unit_template_id: unit_template_id,
      classroom_id: class_id,
      student_ids: student_ids,
      last: true,
      lesson: true,
      assign_on_join: assign_on_join
    }
    AssignRecommendationsWorker.perform_async(**argument_hash)
  end

  def self.delete_all_caches
    UnitTemplate.all.each { |ut| $redis.del("unit_template_id:#{ut.id}_serialized") }
    $redis.del('production_unit_templates')
    $redis.del('beta_unit_templates')
    $redis.del('alpha_unit_templates')
    $redis.del('private_unit_templates')
  end

  private

  def delete_relevant_caches
    $redis.del("unit_template_id:#{id}_serialized", "#{flag || 'production'}_unit_templates")
    yield
    $redis.del("unit_template_id:#{id}_serialized", "#{flag || 'production'}_unit_templates")
  end


end
