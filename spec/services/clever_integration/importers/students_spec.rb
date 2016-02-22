require 'rails_helper'

describe 'CleverIntegration::Importers::Students' do

  let!(:classrooms) {

  }

  let!(:district_token) {

  }


  def subject
    CleverIntegration::Importers::Students.run(classrooms, district_token)
  end


end