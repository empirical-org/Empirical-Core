class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  belongs_to :author
  has_and_belongs_to_many :activities
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
    student_ids = StudentsClassrooms.where(classroom_id: class_id).ids
    student_ids.compact!
    AssignRecommendationsWorker.perform_async(unit_template_id, class_id, student_ids, true)
  end

  private

  def delete_relevant_caches
    $redis.del("unit_template_id:#{self.id}_serialized", "#{self.flag || 'production'}_unit_templates")
    yield
    $redis.del("unit_template_id:#{self.id}_serialized", "#{self.flag || 'production'}_unit_templates")
  end


end
