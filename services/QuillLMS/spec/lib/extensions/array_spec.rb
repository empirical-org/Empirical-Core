# frozen_string_literal: true

require 'rails_helper'

describe Array do
  describe '#median' do
    let(:odd_sized_letters) { %w{e a b c d} }
    let(:even_sized_letters) {%w{f e a b c d} }
    let(:odd_sized_numbers) { [3,2,1] }
    let(:even_sized_numbers) { [4,3,2,1] }
    let(:one_number) { [1] }
    let(:two_numbers) { [1,2] }
    let(:mixed_types) { [3,'a',1] }

    it 'should return middle in odd-sized letters' do
      expect(odd_sized_letters.median).to eq 'c'
    end

    it 'should return larger of middle two in even-sized' do
      expect(even_sized_letters.median).to eq 'd'
    end

    it 'should return middle in odd-sized numbers' do
      expect(odd_sized_numbers.median).to eq 2
    end

    it 'should return avg of middle two in even-sized numbers' do
      expect(even_sized_numbers.median).to eq 2.5
    end

    it 'should return the one element for size == 1' do
      expect(one_number.median).to eq 1
    end

    it 'should return the average for two number elements' do
      expect(two_numbers.median).to eq 1.5
    end

    it 'should raise an error for mixed type lists' do
      expect {mixed_types.median}.to raise_error(ArgumentError)
    end
  end
end
