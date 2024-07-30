# frozen_string_literal: true

require 'rails_helper'

shared_context 'array and hash data fields' do |data_field|
  let(:data_field) { data_field }
  let(:uid1) { 'uid1' }
  let(:uid2) { 'uid2' }
  let(:feedback1) { 'focus 1' }
  let(:feedback2) { 'focus 2' }
  let(:data) { { data_field => data_field_values } }
  let(:field_name1) { "#{data_field}.#{uid1}" }
  let(:field_name2) { "#{data_field}.#{uid2}" }
  let(:translation_map1) { question.translation_mappings.find_by(field_name: field_name1) }
  let(:translation_map2) { question.translation_mappings.find_by(field_name: field_name2) }
  context 'array' do
    let(:data_field_values) {
      [
        { 'uid' => uid1, 'feedback' => feedback1, text: 'regex' },
        { 'uid' => uid2, 'feedback' => feedback2, text: 'regex' }
      ]
    }

    it "creates translation mappings for focusPoints" do
      subject
      expect(translation_map1.text).to eq(feedback1)
      expect(translation_map2.text).to eq(feedback2)
    end
  end

  context 'hash' do
    let(:data_field_values) {
      {
        uid1 => { 'feedback' => feedback1, text: 'regex' },
        uid2 => { 'feedback' => feedback2, text: 'regex' }
      }
    }

    it "creates translation mappings for focusPoints" do
      subject
      expect(translation_map1.text).to eq(feedback1)
      expect(translation_map2.text).to eq(feedback2)
    end
  end
end

RSpec.describe TranslatableQuestion do
  before do
    ENV['CMS_URL'] = 'https://cms.quill.org'
    stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/responses")
    .to_return(status: 200, body: [].to_json, headers: {})
  end

  describe 'create_translation_mappings' do
    subject { question.create_translation_mappings }

    let(:question) { create(:question, data: data) }

    context 'instructions' do
      let(:field_name) { 'instructions' }
      let(:data) { { field_name => instructions } }
      let(:instructions) { "do this question" }

      it 'creates translation_mappings for instructions' do
        subject
        instructions_mapping = question.translation_mappings.find_by(field_name:)
        expect(instructions_mapping.text).to eq(instructions)
      end
    end

    context 'incorrectSequences' do
      include_context 'array and hash data fields', TranslatableQuestion::INCORRECT_SEQUENCES
    end

    context 'focusPoints' do
      include_context 'array and hash data fields', TranslatableQuestion::FOCUS_POINTS
    end

    context 'cms_responses' do
      let(:question) { create(:question) }
      let(:field_name) { TranslatableQuestion::CMS_RESPONSES }

      context 'the CMS does not have responses for this question' do
        let(:translation_mappings) { question.translation_mappings }
        let(:translated_field_names) { translation_mappings.map(&:field_name) }

        it 'does not make any translation mappings for cms_responses' do
          subject
          expect(translated_field_names).not_to include(a_string_starting_with(field_name))
        end
      end

      context 'the CMS does have responses for this question' do
        let(:id1) { 8856116 }
        let(:id2) { 8856117 }
        let(:feedback1) { "Good job! That's the correct answer." }
        let(:feedback2) { "\u003Cb\u003EWell done!\u003C/b\u003E That's the correct answer." }
        let(:response_data) {
          [
            {
              "id": id1,
              "question_uid": "-Jzw0qjNNnNInNWZT9tJ",
              "text": "Last year, my teacher knew my name.",
              "feedback": feedback1
            },
            {
              "id": id2,
              "question_uid": "-Jzw0qjNNnNInNWZT9tJ",
              "text": "Last year, my teacher knew my name.",
              "feedback": feedback2
            }
          ]
        }
        let(:field_name1) { "#{field_name}.#{id1}" }
        let(:field_name2) { "#{field_name}.#{id2}" }
        let(:translation_map1) { question.translation_mappings.find_by(field_name: field_name1) }
        let(:translation_map2) { question.translation_mappings.find_by(field_name: field_name2) }

        before do
          stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/responses")
          .to_return(status: 200, body: response_data.to_json, headers: {})
        end

        it 'makes translation mappings with the results' do
          subject
          expect(translation_map1.text).to eq(feedback1)
          expect(translation_map2.text).to eq(feedback2)
        end
      end
    end
  end

  describe "#translated_data(locale:)" do
    subject { question.translated_data(locale:) }

    let(:question) { create(:question, :with_all_translations) }
    let(:locale) { Translatable::DEFAULT_LOCALE }

    shared_examples 'translatable field' do |field_key|
      let(:translated_field) { subject[field_key] }
      let(:field_mappings) { question.translation_mappings.where("field_name LIKE ?", "#{field_key}%") }

      it "includes translations for all #{field_key}" do
        field_mappings.each do |mapping|
          translated_text = mapping.translated_texts.find_by(locale:)

          expect(translated_field).to have_key(mapping.field_name)
          expect(translated_field[mapping.field_name]).to eq(translated_text.translation)
        end
      end

      it "does not include untranslated #{field_key}" do
        untranslated_field_names = field_mappings.map(&:field_name) - translated_field.keys

        expect(untranslated_field_names).to be_empty,
          "These #{field_key} were not translated: #{untranslated_field_names.join(', ')}"
      end
    end

    it 'has all the data types' do
      expect(subject).to include(
        Question::FOCUS_POINTS,
        Question::INCORRECT_SEQUENCES,
        Question::CMS_RESPONSES,
        Question.default_translatable_field
      )
    end

    context 'focus points' do
      it_behaves_like 'translatable field', Question::FOCUS_POINTS
    end

    context 'incorrect sequences' do
      it_behaves_like 'translatable field', Question::INCORRECT_SEQUENCES
    end

    context 'CMS responses' do
      it_behaves_like 'translatable field', Question::CMS_RESPONSES
    end

    it 'returns the translated instructions' do
      expect(subject[Question.default_translatable_field]).to eq(question.translation(locale:))
    end

    it 'returns an empty array when translation is not available' do
      # Remove one translation to test fallback
      question.translation_mappings.where(field_name: "#{Question::FOCUS_POINTS}.#{question.data[Question::FOCUS_POINTS].keys.first}").destroy_all

      expect(subject[Question::FOCUS_POINTS].values).to be_empty
    end
  end
end
