# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe MalformedJSONFixer do
        subject { described_class.run(raw_text:) }

        let(:fixed_text) { '{"key1":"value1","key2":"value2"}' }

        context 'missing opening quote' do
          context 'on first key' do
            let(:raw_text) { '{ key1":"value1","key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on second key' do
            let(:raw_text) { '{"key1":"value1",key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on first value' do
            let(:raw_text) { '{"key1":value1","key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on second value' do
            let(:raw_text) { '{"key1":"value1","key2":value2"}' }

            it { is_expected.to eq fixed_text }
          end
        end

        context 'missing closing quote' do
          context 'on first key' do
            let(:raw_text) { '{"key1:"value1","key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on second key' do
            let(:raw_text) { '{"key1":"value1","key2:"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on first value' do
            let(:raw_text) { '{"key1":"value1,"key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on second value' do
            let(:raw_text) { '{"key1":"value1","key2":"value2}' }

            it { is_expected.to eq fixed_text }
          end
        end

        context 'missing opening and closing quotes' do
          context 'on first key' do
            let(:raw_text) { '{ key1 :"value1", "key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on first value' do
            let(:raw_text) { '{ "key1": value1,"key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on first key and value' do
            let(:raw_text) { '{key1: value1, "key2":"value2"}' }

            it { is_expected.to eq fixed_text }
          end

          context 'on second key and value' do
            let(:raw_text) { '{"key1": "value1", key2:value2}' }

            it { is_expected.to eq fixed_text }
          end
        end
      end
    end
  end
end









# # frozen_string_literal: true

# require 'rails_helper'

# module Evidence
#   module Research
#     module GenAI
#       RSpec.describe MissingJSONQuoteFixer do
#         subject { described_class.run(raw_text:) }

#         let(:fixed_text) { '{"key1":"value1","key2":"value2"}' }

#         context 'missing opening quote' do
#           context 'on first key' do
#             let(:raw_text) { '{key1":"value1","key2":"value2"}' }

#             it { is_expected.to eq fixed_text }
#           end




#     end
#   end
# end
