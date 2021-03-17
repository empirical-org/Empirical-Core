class Api::V1::RuleFeedbackHistoriesController < Api::ApiController
    skip_before_action :verify_authenticity_token

    def by_conjunction 
        report = RuleFeedbackHistory.generate_report(by_conjunction_params)
        render(json: report)
    end

    private def by_conjunction_params
        params.require(:conjunction)
    end
end
