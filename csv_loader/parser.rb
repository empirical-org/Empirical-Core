require File.expand_path('../../config/environment', __FILE__)
Dir.glob(File.expand_path('../../core/models/*', __FILE__)).each{|f| require f }
Topic
Dir.glob(File.expand_path('../../../Quill-Lessons/app/models/*', __FILE__)).each{|f| require f }
require 'csv'
require 'active_support/core_ext'

class AprilFirst2014QuestionParser
  def initialize data
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

      current_rule[:questions] << {
        body: YAML.load(row[:answers]),
        prompt: row[:question],
        instructions: row[:instructions]
      }

      out
    end

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
      topic_loader = TopicLoader.new(topic)
      topic_record = topic_loader.load

      activities.each do |activity|
        rules = activity.delete(:rules)
        activity_loader = ActivityLoader.new(activity.merge(topic_id: topic_record.id, data: {}))
        activity_record = activity_loader.load

        rules.each do |rule|
          questions = rule.delete(:questions)
          rule_loader = RuleLoader.new(rule.merge(activity_id: activity_record.id))
          rule_record = rule_loader.load

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
        sum[key] = @attrs[key]
        sum
      end

      model.where(params).first
    end

    def model
      (self.class.name.split('::').last.sub('Loader','')).constantize
    end

    def load
      record = find
      record = nil unless record
      record ||= model.new
      record.attributes = @attrs
      record.save!
      record
    end
  end

  class TopicLoader < RecordLoader
    def finder_keys
      [:name]
    end
  end

  class ActivityLoader < RecordLoader
    def finder_keys
      [:name, :description]
    end
  end

  class RuleLoader < RecordLoader
    def load
      activity = Activity.find(@attrs.delete(:activity_id))
      old_rule_id = @attrs.delete(:old_rule_id)
      old_rule = Rule.find(old_rule_id)
      @attrs = @attrs.reverse_merge(old_rule.attributes.symbolize_keys).except(:created_at, :updated_at, :id)
      puts @attrs.inspect
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
