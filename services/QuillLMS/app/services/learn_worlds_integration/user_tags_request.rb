# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    def endpoint
      "#{USER_TAGS_ENDPOINT}/#{learn_worlds_account.external_id}"
    end

    def run
      raise NilUserError if user.nil?
      HTTParty.put(endpoint, body: body, headers: headers)
    end

    def body = data.to_json

    def data = { tags: tags }

    def string_to_subject_area_tag(raw_str)
      "subject_area_#{raw_str.downcase.gsub(/[\s\/]+/, '_')}"
    end

    def tags
      subjects_taught = user&.teacher_info&.subject_areas || []
      user_account_type = user.admin? ? 'admin' : 'teacher'
      (subjects_taught.compact.map{ |x| string_to_subject_area_tag(x)} << user_account_type)
    end

  end
end
