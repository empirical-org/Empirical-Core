require 'rails_helper'

describe 'CleverIntegration::Parsers::Students' do

      name = self.generate_name(student_response[:name][:first], student_response[:name][:last])
      {
        clever_id: student_response[:id],
        email: student_response[:email],
        name: name
      }



  let!(:response) {
    [
      {id: '1', email: 'student@gmail.com', name: {first: 'john' last: 'smith'}}
    ]
  }

  let!(:expected) {
    [
      {clever_id: '1', email: 'student@gmail.com', name: 'John Smith'}
    ]
  }

  def subject
    CleverIntegration::Parsers::Students.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end