# frozen_string_literal: true

require 'rails_helper'

describe ConceptResultSchema do
  describe '#run' do
    let(:metadatas) do
      [
        {
          primKey: 1,
          objKey: {
            foo: 1
          }
        },
        {
          primKey: 2,
          objKey: {
            bar: 2
          }
        },
        {
          primKey: [],
          objKey: {
            foo: 'a',
            bar: 'b'
          }
        }
      ]

    end

    it 'should return a schema' do
      metadatas.each do |metadata|
        create(:concept_result, metadata: metadata)
      end

      result = ConceptResultSchema.run

      expected = {
        "answer"=>["string"],
        "correct"=>["integer"],
        "primKey"=>["integer", "array"],
        "objKey"=> [
          {"foo"=>["integer"]},
          {"bar"=>["integer"]},
          {"foo"=>["string"], "bar"=>["string"]}
        ]
      }

      expect(result).to eq expected
    end
  end

  describe '#merge_schema' do
    it 'should basic' do
      hash1 = {
        primKey: ['integer'],
        arrayKey: ['array'],
        objKey: [{
          foo: ['integer']
        }]
      }

      hash2 = {
        primKey: ['boolean'],
        arrayKey: ['boolean'],
        objKey: ['boolean']
      }

      expected = {
        primKey: ['integer', 'boolean'],
        arrayKey: ['array', 'boolean'],
        objKey: [{foo: ['integer']}, 'boolean']
      }

      result = ConceptResultSchema.merge_schema(hash1, hash2)
      expect(result).to eq expected
    end
  end

  describe '#compute' do
    context 'input is primitive' do
      it 'should return the primitive type' do
        expect(ConceptResultSchema.compute(1)).to eq ['integer']
        expect(ConceptResultSchema.compute(nil)).to eq ['null']
        expect(ConceptResultSchema.compute(true)).to eq ['boolean']
      end
    end

    it 'should recursively discover types' do
      json = {
        primKey: 1,
        arrayKey: [2],
        objKey: {
          foo: 1
        }
      }
      result = ConceptResultSchema.compute(json)
      expected = [{
        primKey: ['integer'],
        arrayKey: ['array'],
        objKey: [{
          foo: ['integer']
        }]
      }]
      expect(result).to eq expected
    end
  end
end
