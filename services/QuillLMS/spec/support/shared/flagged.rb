# frozen_string_literal: true

shared_examples_for "flagged" do

  let(:flagged) do
    described_class.new
  end

  describe "#flag" do
    it "must act as a push" do
      expect(flagged.flag(:alpha)).to eq [:alpha]
    end
  end

  context "when 2 elements are pushed" do
    describe "#flags" do
      before do
        flagged.flag :alpha
        flagged.flag :betha
      end

      it "must be an array" do
        expect(flagged.flags).to an_instance_of Array
      end

      it "must to contains 2 elements" do
        expect(flagged.flags.count).to eq 2
      end
    end
  end

  context "when alpha and betha are pushed" do
    describe "#unflag" do
      before do
        flagged.flag :alpha
        flagged.flag :betha
      end

      it "must pop the passed flag as argument" do
        flagged.unflag :alpha
        expect( flagged.flags ).to eq [:betha]
      end

      it "must to contains 1 elements" do
        flagged.unflag :alpha
        expect( flagged.flags.count ).to eq 1
      end
    end
  end

  context "when methods preserve the changes" do
    after do
      expect(flagged).to be_persisted
    end

    describe "#flag!" do
      it "must push the flag and save the instance" do
        expect(flagged.flag!(:alpha)).to eq true
      end
    end


    describe "#unflag!" do
      it "must pop the flag and save the instance" do
        expect(flagged.unflag!(:alpha)).to eq true
      end
    end

    describe "#archive!" do
      it "must push the archived flag and save the instance" do
        flagged.archive!
        expect(flagged.flags).to eq [:archived]
      end
    end

    describe "#unarchive!" do
      it "must pop the archived flag and save the instance" do
        flagged.archive!
        flagged.unarchive!
        expect(flagged.flags).to eq []
      end
    end
  end

end