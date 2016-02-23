require 'rails_helper'

describe 'CleverIntegration::Sync::SubMain' do

  def subject
    CleverIntegration::Sync::SubMain.run
  end

=begin
creates teachers
associates teachers to district
creates sections
associations sections to teachers
creates students
associates students to sections
=end




end