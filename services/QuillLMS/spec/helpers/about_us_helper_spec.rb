# frozen_string_literal: true

require 'rails_helper'

describe AboutUsHelper do
  describe '#about_us_tabs' do
    let(:large_tabs) {
      [
        {id: 'About Us', name: 'About Us', url: '/about'},
        {id: 'Impact', name: 'Impact', url: '/impact'},
        {id: 'Pathways Initiative', name: 'Pathways Initiative', url: '/pathways'},
        {id: 'Team', name: 'Team', url: '/team'},
        {id: 'Careers', name: 'Careers', url: '/careers'},
        {id: 'Press', name: 'Press', url: '/press'}
      ]
    }
    let(:small_tabs)  {
      [
        {id: 'About Us', name: 'About', url: '/about'},
        {id: 'Impact', name: 'Impact', url: '/impact'},
        {id: 'Pathways Initiative', name: 'Pathways', url: '/pathways'},
        {id: 'Team', name: 'Team', url: '/team'},
        {id: 'Careers', name: 'Careers', url: '/careers'},
        {id: 'Press', name: 'Press', url: '/press'}
      ]
    }

    it 'should return the large tabs when large is true' do
      expect(helper.about_us_tabs(large: true)).to eq large_tabs
    end

    it 'should return the small tabs when large is false' do
      expect(helper.about_us_tabs(large: false)).to eq small_tabs
    end
  end
end
