require 'rails_helper'

describe ApplicationHelper do
  include_context RSpec::ROUTING_URL_HELPERS

  describe "#combine" do
    it 'should add the arrays' do
      expect(combine([1, 2], [3, 4])).to eq [1, 2, 3, 4]
    end
  end

  describe '#active_on_first' do
    it 'should give active if i is 0' do
      expect(active_on_first(0)).to eq "active"
      expect(active_on_first(1)).to_not eq "active"
    end
  end

  describe '#pages' do
    it 'should return the correct array' do
      expect(pages).to eq %w{home the_peculiar_institution democracy_in_america aggregation}
    end
  end

  describe '#root_path' do
    it 'should return the root_url' do
      expect(root_path).to eq root_url
    end
  end

  describe '#body_class' do
    it 'should return the body class' do
      helper.instance_variable_set("@body_class", "body")
      expect(helper.body_class).to eq "body"
    end
  end

  describe '#body_id' do
    it 'should return the body id' do
      helper.instance_variable_set("@body_id", "body_id")
      expect(helper.body_id).to eq "body_id"
    end
  end

  describe '#ordinal' do
    it 'should add the correct suffix' do
      expect(ordinal(1)).to eq "1st"
      expect(ordinal(2)).to eq "2nd"
      expect(ordinal(3)).to eq "3rd"
      expect(ordinal(4)).to eq "4th"
      expect(ordinal(5)).to eq "5th"
      expect(ordinal(11)).to eq "11th"
      expect(ordinal(12)).to eq "12th"
      expect(ordinal(13)).to eq "13th"
    end
  end
end