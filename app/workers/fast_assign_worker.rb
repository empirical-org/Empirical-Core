


class FastAssignWorker
  include Sidekiq::Worker

  def perform(current_user, id)
    logger.debug "Here's some info: #{hash.inspect}"
    logger.debug "ID: #{id}"
    Units::Creator.fast_assign_unit_template(current_user, id)
  end

end
