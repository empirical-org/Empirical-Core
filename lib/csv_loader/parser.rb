require File.expand_path('../../config/environment', __FILE__)
require 'csv'
require 'active_support/core_ext'

class AprilFirst2014QuestionParser
  def initialize data, name = nil
    @name = name
    @raw = data
  end

  def csv
    @csv = CSV.parse(@raw, headers: headers)
  end

  def headers
    [:activity, :topic, :new_rule_id, :question_id, :answers, :old_rule_id, :question, :instructions, :examples]
  end

  def tree!
    @tree = nil
    tree
  end

  def load!
    tree!
    load
  end

  def tree
    return @tree if @tree.present?
    current_topic = nil
    current_activity = nil
    rule_set = []

    @tree = csv.inject({topics: []}) do |out, row|
      @current_row = row

      if row[:topic].present?
        current_topic = {name: row[:topic], activities: []}
        out[:topics] << current_topic
        rule_set = []
      end

      if row[:activity].present?
        current_activity = {name: row[:activity], rules: {}}
        current_topic[:activities] << current_activity
        next out
      end

      unless row[:new_rule_id].to_s =~ /[0-9]+/
        row[:new_rule_id] = :alpha
      end

      rule_key = "#{current_activity[:name]}-#{row[:new_rule_id]}"
      rule_id = -> { (rule_set.index(rule_key) + 1).to_s }

      if rule_set.include? rule_key
        id = rule_id.()
        current_rule = current_activity[:rules][id]
      else
        rule_set << rule_key

        current_rule = {
          id: rule_id.(),
          uid: rule_key,
          old_rule_id: row[:old_rule_id],
        }

        current_rule[:description] = row[:examples] if row[:examples].present?
        current_rule[:questions] = []

        current_activity[:rules][current_rule[:id]] = current_rule
      end

      body = (row[:answers].presence && YAML.load(row[:answers])) || []

      current_rule[:questions] << {
        body: body,
        prompt: row[:question],
        instructions: row[:instructions]
      }

      out
    end

    @current_row = nil

    @tree[:topics].each do |topic|
      topic[:activities].each do |activity|
        activity[:rules] = activity[:rules].values
      end
    end

    @tree
  end

  def load
    tree[:topics].each do |topic|
      activities = topic.delete(:activities)
      topic_loader = TopicLoader.new(topic.except(:id))
      topic_record = topic_loader.load

      activities.each do |activity|
        rules = activity.delete(:rules)
        activity_loader = ActivityLoader.new(activity.merge(topic_id: topic_record.id, data: {}))
        activity_record = activity_loader.load
        activity_record.flag! :production

        rules.each do |rule|
          questions = rule.delete(:questions)
          rule_loader = RuleLoader.new(rule.merge(activity_id: activity_record.id))
          rule_record = rule_loader.load
          rule_record.flag! :production

          questions.each do |question|
            question_loader = QuestionLoader.new(question.merge(rule_id: rule_record.id))
            question_record = question_loader.load
          end
        end
      end
    end
  end

  class RecordLoader
    def initialize attrs
      @attrs = attrs
    end

    def find
      params = finder_keys.inject({}) do |sum, key|
        val = @attrs[key]
        val = val.to_yaml if val.is_a?(Array)
        sum[key] = val
        sum
      end

      model.where(params).first
    end

    def model
      (self.class.name.split('::').last.sub('Loader','')).constantize
    end

    def load
      record = find
      record ||= model.new
      record.attributes = @attrs.except(:id)
      record.save!
      record
    end
  end

  class TopicLoader < RecordLoader
    def load
      begin
        result = super
      rescue ActiveRecord::RecordNotUnique => e
        puts "Retrying loading of topic"
        sleep 0.1
        retry
      end

      result
    end

    def finder_keys
      [:name]
    end
  end

  class ActivityLoader < RecordLoader
    def load
      @attrs[:activity_classification_id] = ActivityClassification.find_by_key!('practice_question_set').id
      super
    end

    def finder_keys
      [:name, :description]
    end
  end

  class RuleLoader < RecordLoader
    def load
      activity = Activity.find(@attrs.delete(:activity_id))
      old_rule_id = @attrs.delete(:old_rule_id)
      old_rule = Rule.find_by_id(old_rule_id)
      @attrs = @attrs.reverse_merge(old_rule.attributes.symbolize_keys) if old_rule.present?
      @attrs = @attrs.except(:created_at, :updated_at, :id)

      if @attrs[:name].blank?
        @attrs[:flags] ||= []
        @attrs[:flags] << :beta
        @attrs[:name] = @attrs[:uid]
      end

      rule = super

      rule_id = rule.id

      rule_position = if activity.data['rule_position'].nil?
        []
      else
        YAML.load(activity.data['rule_position'])
      end

      rule_position << rule_id

      activity.data = activity.data.merge('rule_position' => rule_position.to_yaml)
      activity.save!

      rule
    end

    def find
      Rule.find_by_uid(@attrs[:uid])
    end
  end

  class QuestionLoader < RecordLoader
    def finder_keys
      [:body, :prompt, :instructions, :hint]
    end

    def model
      RuleQuestion
    end
  end
end
