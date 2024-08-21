# spec/services/evidence/gen_ai/primary_feedback/static_prompt_builder_spec.rb
require 'rails_helper'

RSpec.describe Evidence::GenAI::PrimaryFeedback::StaticPromptBuilder do
  let(:prompt_id) { 'my_prompt_id' }
  let(:prompt_builder) { described_class.new(prompt_id) }
  let(:prompt_file_path) { File.join(described_class::PROMPT_FOLDER, "#{prompt_id}.md") }

  describe '#run' do
    context 'live files' do
      let(:coral_reef_because_prompt_id) { 673 }

      subject {described_class.run(coral_reef_because_prompt_id)}

      it 'should return text' do
        expect(subject).to_not be_nil
      end
    end

    context 'when the prompt file exists' do
      before do
        allow(File).to receive(:exist?).with(prompt_file_path).and_return(true)
        allow(File).to receive(:read).with(prompt_file_path).and_return('Sample prompt content')
      end

      it 'returns the content of the prompt file' do
        expect(prompt_builder.run).to eq('Sample prompt content')
      end
    end

    context 'when the prompt file does not exist' do
      before do
        allow(File).to receive(:exist?).with(prompt_file_path).and_return(false)
      end

      it 'returns nil' do
        expect(prompt_builder.run).to be_nil
      end
    end
  end

  describe '#prompt_id' do
    it 'returns the prompt_id passed to the constructor' do
      expect(prompt_builder.prompt_id).to eq(prompt_id)
    end
  end

  describe '#file_path' do
    it 'returns the full path to the prompt file' do
      expect(prompt_builder.send(:file_path)).to eq(prompt_file_path)
    end
  end

  describe '#static_prompt_exists?' do
    context 'when the prompt file exists' do
      before do
        allow(File).to receive(:exist?).with(prompt_file_path).and_return(true)
      end

      it 'returns true' do
        expect(prompt_builder.send(:static_prompt_exists?)).to be true
      end
    end

    context 'when the prompt file does not exist' do
      before do
        allow(File).to receive(:exist?).with(prompt_file_path).and_return(false)
      end

      it 'returns false' do
        expect(prompt_builder.send(:static_prompt_exists?)).to be false
      end
    end
  end

  describe '#static_prompt' do
    context 'when the prompt file exists' do
      before do
        allow(File).to receive(:read).with(prompt_file_path).and_return('Sample prompt content')
      end

      it 'returns the content of the prompt file' do
        expect(prompt_builder.send(:static_prompt)).to eq('Sample prompt content')
      end
    end
  end
end
