class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  belongs_to :author
  has_and_belongs_to_many :activities
  has_many :units
  serialize :grades, Array

  validates :flag,                  inclusion: { in: %w(alpha beta production),
                                    message: "%{value} is not a valid flag" }, :allow_nil => true


  scope :production, -> {where("unit_templates.flag IN('production') OR unit_templates.flag IS null")}
  scope :beta_user, -> { where("unit_templates.flag IN('production','beta') OR unit_templates.flag IS null")}
  scope :alpha_user, -> { where("unit_templates.flag IN('production','beta','alpha') OR unit_templates.flag IS null")}
  around_save :delete_relevant_caches


  def activity_ids= activity_ids
    self.activities = Activity.find(activity_ids)
  end

  def related_models(flag)
    UnitTemplate.user_scope(flag).where(unit_template_category_id: self.unit_template_category_id).where.not(id: self.id).limit(3)
  end

  def activity_ids
    self.activities.ids
  end

  def activities
    Activity.joins('INNER JOIN activity_category_activities AS aca ON aca.activity_id = activities.id')
    .joins('INNER JOIN activity_categories AS ac ON ac.id = aca.activity_category_id')
    .joins('INNER JOIN activities_unit_templates ON activities.id = activities_unit_templates.activity_id')
    .where("activities_unit_templates.unit_template_id = #{self.id}")
    .order('ac.order_number, aca.order_number')
  end

  def self.user_scope(user_flag)
    if user_flag == 'alpha'
      UnitTemplate.alpha_user
    elsif user_flag == 'beta'
      UnitTemplate.beta_user
    else
      UnitTemplate.production
    end
  end

  def get_cached_serialized_unit_template(flag=nil)
    cached = $redis.get("unit_template_id:#{self.id}_serialized")
    serialized_unit_template = cached.nil? || cached&.blank? ? nil : eval(cached)
    unless serialized_unit_template
      serializable_unit_template = UnitTemplatePseudoSerializer.new(self, flag)
      serialized_unit_template = serializable_unit_template.get_data
      $redis.set("unit_template_id:#{self.id}_serialized", serialized_unit_template)
    end
    serialized_unit_template
  end

  def self.assign_to_whole_class(class_id, unit_template_id)
    assign_on_join = true
    student_ids = [] # student ids will be populated in the classroom activity assign_on_join callback
    AssignRecommendationsWorker.perform_async(unit_template_id, class_id, student_ids, true, true, assign_on_join)
  end

  private

  def delete_relevant_caches
    $redis.del("unit_template_id:#{self.id}_serialized", "#{self.flag || 'production'}_unit_templates")
    yield
    $redis.del("unit_template_id:#{self.id}_serialized", "#{self.flag || 'production'}_unit_templates")
  end


end
