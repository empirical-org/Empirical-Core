module Evidence 
  module Opinion
    class FeedbackAssembler
      OAPI_ERROR_TO_RULE_UID = {
        'using_must' => '5545d756-9ba5-44d5-829a-0479cbbe941e',
        'using_out' => '938dcafb-7b03-4fce-bacb-0ec690eccec0',
        'using_should' => 'aa5884e6-2646-4f4b-b0ed-938a2eab0507',
        'command_check' => '69c71c98-a9bc-49a6-856c-c206520f5e60',
        'common_opinionated_phrases_keyword_check' => '7ade48ba-f073-4ce5-9c54-501d556e99e2',
        'first_person_opinionated_phrase_keyword_check' => '5ed4c961-60e6-4c29-9ace-e80c6492b377',
        'first_person_reference_keyword_check' => 'a900cbe9-f50b-4760-878f-2e3e530db81d',
        'second_person_reference_keyword_check' => '16b5c334-7ac5-4cbf-b61f-a824065cb571',
        'using_maybe' => '6e8c268a-9aac-4f0a-a373-4987bf861e9c',
        'using_perhaps' => '2ca42c1d-9d0e-4d2b-a762-2eb10261f90b',
        'using_please' => '1cb76abe-cd2d-4c87-86aa-b3bc7907c77a',
        'starts_with_a_verb' => '4f4ed261-16f8-44ae-905c-0ad7c6449af4'
      }

      def initialize(client_response)
        @client_response = client_response
        error = @client_response['oapi_error']
        rule_uid = OAPI_ERROR_TO_RULE_UID.fetch(error)
        @rule = Evidence::Rule.where(uid: rule_uid).includes(:feedbacks).first
        @top_feedback = @rule&.feedbacks&.min_by(&:order)
        @optimal = @rule&.optimal.nil? ? true : @rule&.optimal 
      end

      def to_payload 
        {
          'concept_uid': @rule&.concept_uid,
          'feedback': @top_feedback&.text,
          'feedback_type': 'opinion',
          'optimal': @optimal,
          'response_id': '0', # not currently used, but part of Evidence payload spec
          'highlight': @client_response['highlight'],
          'labels': '',       # not currently used, but part of Evidence payload spec
          'rule_uid': @rule&.uid
        }  
      end
    end
    
  end
end
