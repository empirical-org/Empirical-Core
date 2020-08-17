class CronController < ApplicationController

  def run
    Cron.run
    render plain: 'OK'
  end

end