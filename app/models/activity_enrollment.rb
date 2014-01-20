class ActivityEnrollment < ActiveRecord::Base
  belongs_to :classroom_activity
  belongs_to :user
  has_one :activity,   through: :classroom_activity
  has_many :inputs, class_name: 'RuleQuestionInput'

  serialize :story_step_input, Array
  serialize :missed_rules, Array

  before_create :create_uid

  def classroom
    classroom_chapter.classroom
  end

  def missed_rules
    calculate_missed_rules if super.empty? && !new_record?
    super.uniq.map{ |id| Rule.find(id) }
  end

  def grade_name
    return '' unless completed?
    case grade
    when 0.75..1.0
      'green'
    when 0.5..0.75
      'yellow'
    when 0.0..0.5
      'red'
    end

  end

  def grade
    return self[:grade] unless self[:grade].nil?
    return 1.0 if inputs.count == 0
    update_column :grade, inputs.map(&:score).inject(:+) / inputs.count
    self[:grade]
  end

protected

  def create_uid
    self.uid = SecureRandom.urlsafe_base64
  end

private

  def calculate_missed_rules
    self.missed_rules = StoryChecker.find(id).section(:missed).chunks.map { |c| c.rule.id }
  end
end
