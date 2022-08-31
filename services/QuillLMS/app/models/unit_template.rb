# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_templates
#
#  id                        :integer          not null, primary key
#  activity_info             :text
#  flag                      :string
#  grades                    :text
#  image_link                :string
#  name                      :string
#  order_number              :integer          default(999999999)
#  time                      :integer
#  created_at                :datetime
#  updated_at                :datetime
#  author_id                 :integer
#  unit_template_category_id :integer
#
# Indexes
#
#  index_unit_templates_on_activity_info              (activity_info)
#  index_unit_templates_on_author_id                  (author_id)
#  index_unit_templates_on_unit_template_category_id  (unit_template_category_id)
#
class UnitTemplate < ApplicationRecord
  belongs_to :unit_template_category
  belongs_to :author
  has_many :activities_unit_templates, -> { order('order_number ASC') }
  has_many :activities, through: :activities_unit_templates
  has_many :units
  has_many :partner_contents, dependent: :destroy, as: :content
  has_many :recommendations, dependent: :destroy
  has_many :diagnostics_recommended_by, :through => :recommendations, :source => :activity
  serialize :grades, Array

  validates :flag,
    inclusion: { in: Flags::FLAGS },
    allow_nil: true

  PRODUCTION = 'production'
  GAMMA = 'gamma'
  BETA = 'beta'
  ALPHA = 'alpha'
  PRIVATE = 'private'

  scope :production, -> {where("unit_templates.flag IN('#{PRODUCTION}') OR unit_templates.flag IS null")}
  scope :gamma_user, -> { where("unit_templates.flag IN('#{PRODUCTION}','#{GAMMA}') OR unit_templates.flag IS null")}
  scope :beta_user, -> { where("unit_templates.flag IN('#{PRODUCTION}','#{GAMMA}','#{BETA}') OR unit_templates.flag IS null")}
  scope :alpha_user, -> { where("unit_templates.flag IN('#{PRODUCTION}','#{GAMMA}','#{BETA}','#{ALPHA}') OR unit_templates.flag IS null")}
  scope :private_user, -> { where("unit_templates.flag IN('private', '#{PRODUCTION}','#{GAMMA}','#{BETA}','#{ALPHA}') OR unit_templates.flag IS null")}

  USER_SCOPES = {
    PRIVATE => UnitTemplate.private_user,
    ALPHA => UnitTemplate.alpha_user,
    BETA => UnitTemplate.beta_user,
    GAMMA => UnitTemplate.gamma_user
  }

  around_save :delete_relevant_caches

  WHOLE_CLASS_LESSONS = 'Whole class lessons'
  INDEPENDENT_PRACTICE = 'Independent practice'
  DIAGNOSTIC = 'Diagnostic'

  def readability
    activities_with_raw_scores = activities.joins(:raw_score).where.not(raw_score: nil).reorder("raw_scores.order ASC")
    return nil if activities_with_raw_scores.empty?

    lowest_raw_score_activity = activities_with_raw_scores.first
    highest_raw_score_activity = activities_with_raw_scores.last

    lowest_readability_range = lowest_raw_score_activity.readability_grade_level
    highest_readability_range = highest_raw_score_activity.readability_grade_level

    "#{lowest_readability_range.split('-')[0]}-#{highest_readability_range.split('-')[1]}"
  end

  def grade_level_range
    activities_with_minimum_grade_levels = activities.where.not(minimum_grade_level: nil).reorder("minimum_grade_level ASC")
    return nil if activities_with_minimum_grade_levels.empty?

    highest_grade_range_activity = activities_with_minimum_grade_levels.last

    "#{highest_grade_range_activity.minimum_grade_level.ordinalize}-#{highest_grade_range_activity.maximum_grade_level.ordinalize}"
  end

  def diagnostic_names
    diagnostics_recommended_by.pluck(:name)
  end

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
    USER_SCOPES.fetch(user_flag, UnitTemplate.production)
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

  def self.assign_to_whole_class(class_id, unit_template_id, last)
    assign_on_join = true
    student_ids = [] # student ids will be populated in the classroom activity assign_on_join callback
    argument_hash = {
      unit_template_id: unit_template_id,
      classroom_id: class_id,
      student_ids: student_ids,
      last: last,
      lesson: true,
      assign_on_join: assign_on_join
    }
    AssignRecommendationsWorker.perform_async(**argument_hash)
  end

  def self.delete_all_caches
    UnitTemplate.all.each { |ut| $redis.del("unit_template_id:#{ut.id}_serialized") }
    %w(private_ production_ gamma_ beta_ alpha_).each do |flag|
      $redis.del("#{flag}unit_templates")
    end
  end

  private def delete_relevant_caches
    $redis.del("unit_template_id:#{id}_serialized", "#{flag || 'production'}_unit_templates")
    yield
    $redis.del("unit_template_id:#{id}_serialized", "#{flag || 'production'}_unit_templates")
  end

end
