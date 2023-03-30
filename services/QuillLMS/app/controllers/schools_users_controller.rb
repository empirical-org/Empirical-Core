# frozen_string_literal: true

class SchoolsUsersController < ApplicationController

  def school_for_current_user
    render json: { school: current_user.school, admins: current_user.school&.admins }, status: 200
  end

end
