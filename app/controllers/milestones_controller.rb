class MilestonesController < ApplicationController

  def has_viewed_lesson_tutorial
    completed = !!Milestone.find_by(name: 'View Lessons Tutorial').users.find(current_user.id)
    render json: {completed: completed}
  end

  def complete_view_lesson_tutorial
    milestone = Milestone.find_by(name: 'View Lessons Tutorial')
    if !::UserMilestone.find_by(user: current_user, milestone: milestone)
      current_user.milestones.push(milestone)
    end
    render json: {}
  end

end
