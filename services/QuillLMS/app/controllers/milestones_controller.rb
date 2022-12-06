# frozen_string_literal: true

class MilestonesController < ApplicationController

  def complete_view_lesson_tutorial
    complete_milestone('View Lessons Tutorial')
  end

  def complete_acknowledge_diagnostic_banner
    complete_milestone(Milestone::TYPES[:acknowledge_diagnostic_banner])
  end

  def complete_acknowledge_evidence_banner
    complete_milestone(Milestone::TYPES[:acknowledge_evidence_banner])
  end

  def complete_acknowledge_growth_diagnostic_promotion_card
    complete_milestone(Milestone::TYPES[:acknowledge_growth_diagnostic_promotion_card])
  end

  def complete_acknowledge_lessons_banner
    complete_milestone(Milestone::TYPES[:acknowledge_lessons_banner])
  end

  def complete_dismiss_grade_level_warning
    complete_milestone(Milestone::TYPES[:dismiss_grade_level_warning])
  end

  def complete_dismiss_school_selection_reminder
    complete_milestone(Milestone::TYPES[:dismiss_school_selection_reminder])
  end

  def create_or_touch_dismiss_teacher_info_modal
    milestone =  Milestone.find_by_name(Milestone::TYPES[:dismiss_teacher_info_modal])

    user_milestone = UserMilestone.find_or_create_by!(milestone: milestone, user: current_user)
    user_milestone.touch

    render json: {}
  end

  private def complete_milestone(milestone_name)
    if current_user
      milestone = Milestone.find_by_name(milestone_name)
      if milestone && !milestone.users.find_by(id: current_user.id)
        current_user.milestones.push(milestone)
      end
    end
    render json: {}
  end

end
