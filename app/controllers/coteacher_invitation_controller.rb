class CoteacherInvitationController < ApplicationController
  before_action :authenticate_classroom_ids_arr, only: create

  def create

  end


  private

  def authenticate_classroom_ids_arr
    
  end


end
