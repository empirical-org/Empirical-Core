class CronController < ApplicationController

  def new
    if request.headers['x-amz-sns-message-type'] == 'SubscriptionConfirmation'
      response = confirm_subscription(JSON.parse(request.body.read))
    else
      Cron.run
    end
    render plain: 'OK'
  end

  def confirm_subscription(request_obj)
    get_url = URI(request_obj['SubscribeURL'])
    Net::HTTP.get(get_url)
  end
end
