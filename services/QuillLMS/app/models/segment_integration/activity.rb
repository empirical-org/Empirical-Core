# frozen_string_literal: true

module SegmentIntegration
  class Activity < SimpleDelegator
    def common_params
      {
        activity_name: name,
        tool_name: classification.name.split[1]
      }.reject {|_,v| v.nil? }
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def content_params
      {
        **common_params,
        concepts: activity_categories.pluck(:name).join(", "),
        content_partners: content_partners.pluck(:name).join(", "),
        first_topic: topics.first.name,
        second_topic: topics.second.name,
        third_topic: topics.third.name
      }.reject {|_,v| v.nil? }
    end
    # rubocop:enable Metrics/CyclomaticComplexity

  end
end
