class UnitTemplate < ActiveRecord::Base
  belongs_to :unit_template_category
  belongs_to :author
  has_and_belongs_to_many :activities
  serialize :grades, Array

  validates :flag,                  inclusion: { in: %w(alpha beta production),
                                    message: "%{value} is not a valid flag" }, :allow_nil => true


  scope :production, -> {where("unit_templates.flag IN('production') OR unit_templates.flag = null")}
  scope :beta_user, -> { where("unit_templates.flag IN('production','beta') OR unit_templates.flag = null")}
  scope :alpha_user, -> { where("unit_templates.flag IN('production','beta','alpha') OR unit_templates.flag = null")}


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


end
