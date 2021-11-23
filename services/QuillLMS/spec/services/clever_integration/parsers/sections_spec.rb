# frozen_string_literal: true

require 'rails_helper'

describe 'CleverIntegration::Parsers::Sections' do

  let!(:response) {
    section = Clever::Section.new({id: '1', name: 'name1', grade: '2'})
    section_response = Clever::SectionResponse.new({ data: section })
    Clever::SectionsResponse.new({ data: [section_response] })
  }

  let!(:expected) {
    [
      {clever_id: '1', name: 'name1', grade: '2'}
    ]
  }

  def subject
    CleverIntegration::Parsers::Sections.run(response.data)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end
