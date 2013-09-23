module ScoreState
  extend ActiveSupport::Concern

  included do
    default_scope where('state != \'trashed\'')
    delegate :unstarted?, :started?, :practice?, :story?, :review?, :finished?, to: :state
  end

  def state
    @state_inquirer = ActiveSupport::StringInquirer.new(self[:state])
  end

  def completed?
    completion_date.present?
  end

  def finalize!
    self.score_values = ScoreFinalizer.new(self).results
    self.completion_date ||= Time.now
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
    define_method "#{step}_lesson_input=" do |hash|
      raise 'cannot be greater than 1' if hash.length > 1
      question, input = hash.first
      inputs.find_or_create_by(step: step, rule_question_id: question).handle_input(input)
    end
  end
end

class Score < ActiveRecord::Base
  include ScoreState, RuleQuestionInputAccessors
  belongs_to :classroom_chapter
  belongs_to :user
  has_one :chapter, through: :classroom_chapter
  has_many :inputs, class_name: 'RuleQuestionInput'
  serialize :practice_lesson_input, Hash
  serialize :review_lesson_input, Hash
  serialize :missed_rules, Array
  serialize :score_values, Hash

  def all_lesson_input
    practice_lesson_input.merge review_lesson_input
  end

  def missed_rules
    super.uniq.map{ |id| Rule.find(id) }
  end

  def final_grade
    return 0.0 unless score_values[:story_percentage].present? && score_values[:review_percentage].present?
    result = (score_values[:story_percentage] + score_values[:review_percentage]).to_f / 2
    return 0.0 if result.nan?
    result
  end
end
