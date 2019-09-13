class CreateOrIncrementResponseWorker
  include Sidekiq::Worker

  def perform(new_vals)
    PUTS 'new_vals', new_vals
    response = Response.find_by(text: new_vals[:text], question_uid: new_vals[:question_uid])
    if !response
      response = Response.new(new_vals)
      if !response.text.blank? && response.save
        AdminUpdates.run(response.question_uid)
      end
    else
      increment_counts(response)
    end
  end

end
