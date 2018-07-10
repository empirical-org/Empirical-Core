require 'rails_helper'

describe FirstLastNameValidator do
  describe '#check_names' do
    context 'when first name or last name is blank' do
      let(:subject) { described_class.new({ first_name: "first", last_name: '' }) }

      it 'should return the failure hash' do
        expect(subject.check_names).to eq({status: "failed", notice: "Please provide both a first name and a last name."})
      end
    end

    context 'when first or last name contains space' do
      let(:subject) { described_class.new({ first_name: "first with spaces", last_name: "last with spaces" }) }

      it 'should return the failure hash' do
        expect(subject.check_names).to eq({status: "failed", notice: "Names cannot contain spaces."})
      end
    end

    context 'when first and last name is correct' do
      let(:subject) { described_class.new({ first_name: "first", last_name: "last" }) }

      it 'should capitalize both and return the hash' do
        expect(subject.check_names).to eq({first_name: "First", last_name: "Last"})
      end
    end
  end

  describe '#strip_first_and_last_name' do
    let(:subject) { described_class.new({ first_name: " first ", last_name: " last " }) }

    it 'should strip the white spaces' do
      subject.strip_first_and_last_names
      expect(subject.instance_variable_get("@name_hash")).to eq({ first_name: "first", last_name: "last" })
    end
  end

  describe "#do_names_contain-spaces" do
    context 'when names contain spaces' do
      let(:subject) { described_class.new({ first_name: "first with space", last_name: "last" }) }

      it 'should return true' do
        expect(subject.do_names_contain_spaces).to eq true
      end
    end

    context 'when names do not contain spaces' do
      let(:subject) { described_class.new({ first_name: "first", last_name: "last" }) }

      it 'should return false' do
        expect(subject.do_names_contain_spaces).to eq false
      end
    end
  end

  describe "#capitralize_first_and_last_name" do
    let(:subject) { described_class.new({ first_name: "first", last_name: "last" }) }

    it 'should capitalize both the first and last name' do
      subject.capitalize_first_and_last_name
      expect(subject.instance_variable_get("@name_hash")).to eq ({ first_name: "First", last_name: "Last" })
    end
  end

end