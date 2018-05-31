class MilestonesController < ApplicationController

  def complete_view_lesson_tutorial
    if current_user
      milestone = Milestone.find_by(name: 'View Lessons Tutorial')
      if !milestone.users.find_by(id: current_user.id)
        current_user.milestones.push(milestone)
      end
    end
    render json: {}
  end

end
