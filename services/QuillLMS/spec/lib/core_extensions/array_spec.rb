# frozen_string_literal: true

require 'rails_helper'

describe CoreExtensions::Array do
  describe '#median' do
    let(:odd_sized_letters) { %w[e a b c d] }
    let(:even_sized_letters) { %w[f e a b c d] }
    let(:odd_sized_numbers) { [3, 2, 1] }
    let(:even_sized_numbers) { [4, 3, 2, 1] }
    let(:one_number) { [1] }
    let(:two_numbers) { [1, 2] }
    let(:mixed_types) { [3, 'a', 1] }

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
      expect { mixed_types.median }.to raise_error(ArgumentError)
    end
  end

  describe '#average' do
    it 'returns 0 for an empty array' do
      expect([].average).to eq(0)
    end

    it 'returns the average of the array elements' do
      expect([1, 2, 3, 4, 5].average).to eq(3.0)
    end
  end

  describe '#dot_product' do
    it 'returns 0 for dot product with an empty array' do
      expect([].dot_product([])).to eq(0)
    end

    it 'calculates the dot product of two arrays' do
      expect([1, 2, 3].dot_product([4, 5, 6])).to eq(32)
    end
  end

  describe '#magnitude' do
    it 'returns 0 for an empty array' do
      expect([].magnitude).to eq(0)
    end

    it 'calculates the magnitude of the array' do
      expect([3, 4].magnitude).to eq(5.0)
    end
  end

  describe '#cosine_similarity' do
    it 'returns 0 for cosine similarity with an empty array' do
      expect([].cosine_similarity([])).to eq(0)
    end

    it 'calculates the cosine similarity between two arrays' do
      expect([1, 0, -1].cosine_similarity([1, 0, -1]).round(6)).to eq(1.0)
    end

    it 'returns 0 when one of the vectors is a zero vector' do
      expect([0, 0, 0].cosine_similarity([1, 2, 3])).to eq(0)
    end
  end

  describe '#cosine_distance' do
    it 'returns 0 when the two arrays are identical' do
      expect([1, 2, 3].cosine_distance([1, 2, 3])).to eq(0.0)
    end

    it 'returns 1 when the two arrays are orthogonal' do
      expect([1, 0].cosine_distance([0, 1])).to eq(1.0)
    end
  end
end
