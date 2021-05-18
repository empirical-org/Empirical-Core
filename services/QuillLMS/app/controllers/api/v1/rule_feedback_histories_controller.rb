class Api::V1::RuleFeedbackHistoriesController < Api::ApiController
    def by_conjunction
        raise ArgumentError unless params.include?('activity_id') && params.include?('conjunction')
        report = RuleFeedbackHistory.generate_report(
            conjunction: params['conjunction'],
            activity_id: params['activity_id']
        )
        render(json: report)
    end

    def rule_detail
        raise ArgumentError unless params.include?('rule_uid') && params.include?('prompt_id')
        report = RuleFeedbackHistory.generate_rulewise_report(
            rule_uid: params['rule_uid'],
            prompt_id: params['prompt_id']
        )
        render(json: report)
    end

end
