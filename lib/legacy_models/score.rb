module ScoreState
  extend ActiveSupport::Concern

  included do
    default_scope { where('scores.state != \'trashed\'') }
    delegate :unstarted?, :started?, :practice?, :story?, :review?, :finished?, to: :state
  end

  def state
    @state_inquirer = ActiveSupport::StringInquirer.new(self[:state])
  end

  def completed?
    completion_date.present?
  end

  def finalize!
    # self.score_values = ScoreFinalizer.new(self).results
    self.completion_date ||= Time.now
    update_column :state, 'finished'
    save!
  end

  def trash!
    update_column :state, 'trashed'
  end

  def practice!
    update_column :state, 'practice'
  end

  def review!
    update_column :state, 'review'
  end

  def story!
    update_column :state, 'story'
  end
end

module RuleQuestionInputAccessors
  extend ActiveSupport::Concern

  %w(practice review).each do |step|
    define_method "#{step}_step_input=" do |hash|
      send "#{step}_handle_input", hash, nil
    end

    define_method "#{step}_handle_input" do |hash, input_step|
      raise 'cannot be greater than 1' if hash.length > 1
      question, input = hash.first
      inputs.find_or_create_by(step: step, rule_question_id: question).handle_input(input, cast_input_step(input_step))
    end
  end

  def cast_input_step input_step
    if input_step.to_s == 'first'
      :first
    elsif input_step.to_s == 'second'
      :second
    elsif input_step.nil?
      nil
    else
      raise 'unacceptable value for cast_input_step'
    end
  end
end

class Score < ActiveRecord::Base
  include ScoreState, RuleQuestionInputAccessors

  belongs_to :classroom_chapter
  belongs_to :user
  has_one :chapter,   through: :classroom_chapter
  has_many :inputs, class_name: 'RuleQuestionInput'

  serialize :story_step_input, Array
  serialize :missed_rules, Array
  # serialize :score_values, Hash

  def classroom
    classroom_chapter.classroom
  end

  def missed_rules
    calculate_missed_rules if !super.any? && !new_record?
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

private

  def calculate_missed_rules
    self.missed_rules = LegacyStoryChecker.find(id).section(:missed).chunks.map { |c| c.rule.id }
  end
end
