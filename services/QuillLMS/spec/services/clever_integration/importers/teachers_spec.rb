require 'rails_helper'

describe 'CleverIntegration::Importers::Teachers' do
  let!(:district) do
    create(:district, name: 'district1', clever_id: '1', token: '1')
  end

  let!(:teachers_response) do
    [
      {id: '1',
       email: 'teacher@gmail.com',
       name: {
        first: 'john',
        last: 'smith'
       }
     }
    ]
  end

  let!(:district_requester) do
    response_struct = Struct.new(:teachers)
    response = response_struct.new(teachers_response)

    lambda do |clever_id, district_token|
      response
    end
  end


  def subject
    CleverIntegration::Importers::Teachers.run(district, district_requester)
    User.find_by(name: 'John Smith', email: 'teacher@gmail.com', clever_id: '1')
  end

  it 'creates a teacher' do
    expect(subject).to_not be_nil
  end

  it 'associates teacher to district' do
    expect(subject.districts.first).to eq(district)
  end
end
