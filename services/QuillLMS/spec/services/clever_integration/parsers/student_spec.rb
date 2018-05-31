require 'rails_helper'

describe 'CleverIntegration::Parsers::Student' do

  let!(:response) {
      {id: '1',
       email: 'student@gmail.com',
       name: {first: 'john', last: 'smith'},
       credentials: {district_username: 'username'}}
  }

  let!(:expected) {
      {clever_id: '1',
       email: 'student@gmail.com',
       name: 'John Smith',
       username: 'username'}
  }

  def subject
    CleverIntegration::Parsers::Student.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end