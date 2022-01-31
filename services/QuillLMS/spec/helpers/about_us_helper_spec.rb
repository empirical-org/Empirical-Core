# frozen_string_literal: true

require 'rails_helper'

describe AboutUsHelper do
  describe '#about_us_tabs' do
    let(:large_tabs) {
      [
        {name: 'About Us', url: 'about'},
        {name: 'Impact', url: 'impact'},
        {name: 'Pathways Initiative', url: 'pathways'},
        {name: 'Team', url: 'team'},
        {name: 'Careers', url: 'careers'},
        {name: 'Press', url: 'press'}
      ]
    }
    let(:small_tabs)  {
      [
        {name: 'About', url: 'about'},
        {name: 'Impact', url: 'impact'},
        {name: 'Pathways', url: 'pathways'},
        {name: 'Team', url: 'team'},
        {name: 'Careers', url: 'careers'},
        {name: 'Press', url: 'press'}
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
