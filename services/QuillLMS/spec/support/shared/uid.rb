# frozen_string_literal: true

shared_examples_for "uid" do


  let(:parent) do
    described_class.new
  end

  context 'when just invoked' do

    it 'uid is nil' do
      expect(parent.uid).to be_nil
    end

  end

  context "when it's validated" do

    it 'uid must be present' do
      parent.valid?
      expect(parent.uid).to be_present
    end

  end


end
