require 'spec_helper'

shared_examples_for "ownable" do

  let(:owner_name){ described_class.owner_name } 
  let(:owner){ FactoryGirl.create(owner_name) }
  let(:parent) do
    described_class.new( :"#{owner_name.to_s}_id" => owner.id )
  end

  describe ".owner_name" do 
      it "must be present " do 
        expect(described_class.owner_name).to be_present
      end
  end

  context "when an instance exists" do 

    describe "#owner_name (i.e. :user)" do 
      it "must have a relationsip with the owner class" do 
        expect(parent.send(owner_name)).to eq owner
      end
    end

    describe "#owner" do
      it "must returns the owner" do
        expect(parent.owner).to eq owner
      end
    end

    describe "#set_owner" do 
      it "must change the owner" do 
        parent.set_owner owner
        expect(parent.send(owner_name) ).to eq owner
      end
    end

    describe "#ownable?" do 
      it "must returns true if .owner_name exists" do 
        expect(parent.ownable?).to be_truthy
      end
    end

    describe "#owned_by?" do 

      it "must return false if argument is nil" do 
        expect(parent.owned_by? nil).to be_falsy
      end

      it "must return false if argument is an empty string" do 
        expect(parent.owned_by? "").to be_falsy
      end      

      it "must return false if owner is not present" do 
        parent.send("#{owner_name.to_s}=",nil)
        expect(parent.owned_by? owner).to be_falsy
      end            

      it "must return true if #owner is eq to the passed object" do 
        expect(parent.owned_by? owner).to be_truthy
      end            

    end

  end


end
