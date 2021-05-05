class Api::V1::RuleFeedbackHistoriesController < Api::ApiController
    skip_before_action :verify_authenticity_token

    def by_conjunction
        raise ArgumentError unless params.include?('activity_id') && params.include?('conjunction')
        report = RuleFeedbackHistory.generate_report(
            conjunction: params['conjunction'],
            activity_id: params['activity_id']
        )
        render(json: report)
    end

    def rule_detail
        raise ArgumentError unless params.include?('rule_uid')
        report = RuleFeedbackHistory.generate_rulewise_report(params['rule_uid'])
        render(json: report)
    end

end
