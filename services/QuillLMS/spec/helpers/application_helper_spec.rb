require 'rails_helper'

describe ApplicationHelper do
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
end