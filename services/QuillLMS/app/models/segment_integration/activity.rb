# frozen_string_literal: true

module SegmentIntegration
  class Activity < SimpleDelegator
    def common_params
      {
        activity_name: name,
        tool_name: classification.name.split[1]
      }.reject {|_,v| v.nil? }
    end

    def content_params
      {
        **common_params,
        concepts: activity_categories.pluck(:name).join(", "),
        content_partners: content_partners.pluck(:name).join(", "),
        topic_level_three: topics.find { |topic| topic.level == 3 }.pluck(:name),
        topic_level_two: topics.find { |topic| topic.level == 2 }.pluck(:name),
        topic_level_one: topics.find { |topic| topic.level == 1 }.pluck(:name),
        topic_level_zero: topics.find { |topic| topic.level == 0 }.pluck(:name),
      }.reject {|_,v| v.nil? }
    end
  end
end
