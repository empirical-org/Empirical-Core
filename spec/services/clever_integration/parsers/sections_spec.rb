require 'rails_helper'

describe 'CleverIntegration::Parsers::Sections' do

  let!(:response) {
    [
      {id: '1', name: 'name1', grade: '2'}
    ]
  }

  let!(:expected) {
    [
      {clever_id: '1', name: 'name1', grade: '2'}
    ]
  }

  def subject
    CleverIntegration::Parsers::Sections.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end