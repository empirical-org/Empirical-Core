# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe MalformedJSONFixer do
        subject { described_class.run(raw_text:) }

        context 'flat structure' do
          let(:fixed_text) { '{"key1":"val1","key2":"val2"}' }

          context 'missing opening quote' do
            context 'on key1' do
              let(:raw_text) { '{ key1":"val1","key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2' do
              let(:raw_text) { '{"key1":"val1",key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val1' do
              let(:raw_text) { '{"key1":val1","key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val2' do
              let(:raw_text) { '{"key1":"val1","key2":val2"}' }

              it { is_expected.to eq fixed_text }
            end
          end

          context 'missing closing quote' do
            context 'on key1' do
              let(:raw_text) { '{"key1:"val1","key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2' do
              let(:raw_text) { '{"key1":"val1","key2:"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val1' do
              let(:raw_text) { '{"key1":"val1,"key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val2' do
              let(:raw_text) { '{"key1":"val1","key2":"val2}' }

              it { is_expected.to eq fixed_text }
            end
          end

          context 'missing opening and closing quotes' do
            context 'on key1' do
              let(:raw_text) { '{ key1 :"val1", "key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val1' do
              let(:raw_text) { '{ "key1": val1,"key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key1 and val2' do
              let(:raw_text) { '{key1: val1, "key2":"val2"}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2 and val2' do
              let(:raw_text) { '{"key1": "val1", key2:val2}' }

              it { is_expected.to eq fixed_text }
            end
          end
        end

        context 'nested key' do
          let(:fixed_text) { '{"key1":{"key2":"val2"},"key3":{"key4":"val4"}}' }

          context 'missing opening quote' do
            context 'on key1' do
              let(:raw_text) { '{key1":{"key2":"val2"},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2' do
              let(:raw_text) { '{"key1":{key2":"val2},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key3' do
              let(:raw_text) { '{"key1":{key2":"val2"},key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key4' do
              let(:raw_text) { '{"key1":{key2":"val2"},"key3":{key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end
          end

          context 'missing closing quote' do
            context 'on key1' do
              let(:raw_text) { '{"key1:{"key2":"val2"},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2' do
              let(:raw_text) { '{"key1":{"key2:"val2"},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key3' do
              let(:raw_text) { '{"key1":{"key2:"val2"},"key3:{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key4' do
              let(:raw_text) { '{"key1":{"key2:"val2"},"key3":{"key4:"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val2' do
              let(:raw_text) { '{"key1":{"key2":"val2},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val4' do
              let(:raw_text) { '{"key1":{"key2":"val2"},"key3":{"key4":"val4}}' }

              it { is_expected.to eq fixed_text }
            end
          end

          context 'missing opening and closing quotes' do
            context 'on key1' do
              let(:raw_text) { '{key1:{"key2":"val2"},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key2' do
              let(:raw_text) { '{key1:{key2:"val2"},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key3' do
              let(:raw_text) { '{key1:{"key2":"val2"},key3:{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key4' do
              let(:raw_text) { '{key1:{"key2":"val2"},"key3":{key4:"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val2' do
              let(:raw_text) { '{"key1":{"key2":val2},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on val4' do
              let(:raw_text) { '{"key1":{"key2":"val2"},"key3":{"key4":val4}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key1, val2' do
              let(:raw_text) { '{key1:{"key2":val2},"key3":{"key4":"val4"}}' }

              it { is_expected.to eq fixed_text }
            end

            context 'on key3, val4' do
              let(:raw_text) { '{"key1":{"key2":"val2"},key3:{"key4":val4}}' }

              it { is_expected.to eq fixed_text }
            end
          end
        end
      end
    end
  end
end
