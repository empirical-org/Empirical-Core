module ChapterFlow
  MAX_QUESTIONS = 3

  def next_page_url recurse = true
    # if the score is unstarted proceed to practice step.
    result = if score.unstarted?
      score.practice!
      @context.chapter_practice_index_path(chapter)
    # we are on one of the two practice steps and we have
    # the id of the practice question.
    elsif params[:step].present? && params[:practice_id].present?
      # index is missing.
      if next_index.present?
        @context.url_for(
          controller: "practice",
          action: "show",
          chapter_id: params[:chapter_id],
          "#{params[:step]}_id" => (params[:id] || params[:practice_id]),
          question_index: next_index,
          step: params[:step]
        )
      else
        next_rule_url
      end
    elsif score.story?
      @context.chapter_story_path(chapter)
    elsif (score.practice? || score.review?) && recurse
      params[:step] = score.state
      params[:question_index] = score.inputs.where(step: params[:step]).count

      # this will fail if the don't miss any of the story.
      # i.e. step(params[:step].to_sym).rules will be empty.
      params[:practice_id] = step(params[:step].to_sym).rules.first.id
      next_page_url(false)
    else
      next_rule_url
    end

    raise "STOP MAKING THEM WITH QUERY STRINGS: #{result}" if result.include?('?')
    result
  end

protected

  def next_rule_url
    if next_rule_id.present?
      @context.send("chapter_#{params[:step]}_path", chapter, next_rule_id)
    else
      step_after_rules_completed
    end
  end

  def step_after_rules_completed
    if params[:step] == "practice"
      score.update_column :state, 'story'
      @context.chapter_story_path(chapter)
    else
      score.finalize!
      score.update_column :state, 'finished'
      @context.chapter_final_path(chapter)
    end
  end

  def next_index
    params[:question_index].to_i + 1 if params[:question_index].to_i < MAX_QUESTIONS
  end

  def next_rule_id
    next_rule.try(:id)
  end

  def next_rule
    step(params[:step].to_sym).next_rule
  end
end

class ChapterTest
  delegate :params, to: :@context
  include ChapterFlow

  def initialize context
    @context = context
  end

  def current_step
    if params[:controller] == "stories"
      :story
    elsif params[:step] == "practice"
      :practice
    elsif params[:step] == "review"
      :review
    elsif params[:action] == "final"
      :final
    else
      raise "unknown step."
    end
  end

  def current_rule
    # why did I do it like this?
    # step(current_step).rules.find{ |r| r.id.to_s == @context.params[:id] }.rule
    @context.instance_variable_get(:@rule)
  end

  def steps
    [:practice, :story, :review].map{ |s| Step.new(s, self) }
  end

  def step step
    steps.find{ |s| s.step == step }
  end

  def chapter
    @context.instance_variable_get(:@chapter)
  end

  def score
    @context.instance_variable_get(:@score)
  end

  class Step
    attr_reader :step

    delegate :current_step, :current_rule, :chapter, :score, to: :@context

    def initialize step, context
      @step = step
      @context = context
    end

    def css_class
      if current_step?
        "#{step} current"
      else
        "#{step} not-current"
      end
    end

    def title
      I18n.t(:title, scope: :"chapter_test_step.#{step}")
    end

    def current_step?
      current_step == step
    end

    def rules
      res = case step
      when :practice
        chapter.practice_rules
      when :story
        []
      when :review
        score.missed_rules
      end

      res.map{ |r| Rule.new(r, @context) }
    end

    def next_rule
      return false if rules.map(&:rule).index(current_rule).blank?
      rules[rules.map(&:rule).index(current_rule) + 1]
    end

    def inputs_for rule
      score.inputs.where(step: step).joins(:rule).where(rules: { id: rule.id })
    end
  end

  class Rule
    attr_reader :rule

    delegate :title, :id, to: :rule
    delegate :current_rule, to: :@context

    def initialize rule, context
      @rule = rule
      @context = context
    end

    def css_class
      if current_rule? then 'current-rule' else '' end
    end

    def current_rule?
      current_rule == rule
    end
  end
end
