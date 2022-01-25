# frozen_string_literal: true

require 'rails_helper'
require 'setup_concepts'
require 'download_concepts'
require 'create_concepts'

VCR.configure do |config|
  config.cassette_library_dir = "fixtures/vcr_cassettes"
  config.hook_into :webmock # or :fakeweb
end

describe 'Downloading the concepts' do
  before(:all) do
    @setup = Setup::DownloadConcepts.new
  end

  before do
    VCR.use_cassette('fetching concepts') do
      @response = @setup.fetch_concepts()
    end
  end

  it "should have an attribute concepts" do
    expect(@setup.concepts.class).to eq(Array)
  end


  it "should successfully make a http request" do
    expect(@response.code).to eq("200")
  end

  it "the response should be a string" do
    expect(@response.body.class).to eq(String)
  end

  it "can convert the string response to JSON" do
    expect(@setup.string_to_json(@response.body).class).to eq(Hash)
  end

  it "hash of data has a list of concepts" do
    expect(@setup.string_to_json(@response.body)["concepts"].class).to eq(Array)
  end

  it "has a hash that represents a concepts inside the list" do
    expect(@setup.concepts.first.class).to eq(Hash)
  end

  it "stores the data" do
    expect(@setup.concepts.empty?).to eq(false)
  end
end

describe "Creating the concepts" do
  context "when there is a child and parent concept" do
    before do
      @parent = {"id"=>1, "name"=>"Capitalization", "uid"=>"BRTGfOy7FGG4LB49eIxJQg", "parent_id"=>nil, "level"=>2}
      @child = {"id"=>2, "name"=>"Greece", "uid"=>"GPzZYKvZ2nSKmu7zC540bA", "parent_id"=>1, "level"=>0}
      @creator = Setup::CreateConcepts.new([@child, @parent])
    end

    it "can find its parent concept" do
      found_parent = @creator.find_parent_concept_from_concepts(@child)
      expect(found_parent).to eq(@parent)
    end

    it "can find or create its parent in the database" do
      expect(Concept.find_by_id(@child["parent_id"])).to be_nil
      found_parent = @creator.find_or_create_parent_in_db(@child)
      expect(found_parent.name).to eq(@parent["name"])
    end

    it "should have a valid parent if required" do
      @creator.create_concept(@child)
      expect(Concept.where(name: "Greece").first.parent_id).to eq(Concept.where(name: "Capitalization").first.id)
    end

    it "should be able add the concepts array into the db" do
      expect(Concept.count).to eq(0)
      @creator.create_all
      expect(Concept.count).to eq(@creator.concepts.length)
      expect(Concept.find_by_name("Greece").parent).to eq(Concept.find_by_name("Capitalization"))
    end
  end

  context "when there is a child, parent and grandparent concept" do
    before do
      @grandparent = {"id"=>3, "name"=>"Alphabet", "uid"=>"BRTGfOy7FGG4LB49eIxJQf", "parent_id"=>nil, "level"=>1}
      @parent = {"id"=>1, "name"=>"Capitalization", "uid"=>"BRTGfOy7FGG4LB49eIxJQg", "parent_id"=>3, "level"=>2}
      @child = {"id"=>2, "name"=>"Greece", "uid"=>"GPzZYKvZ2nSKmu7zC540bA", "parent_id"=>1, "level"=>0}
      @creator = Setup::CreateConcepts.new([@child, @parent, @grandparent])
    end

    it "should be able recursively set parents" do
      expect(Concept.count).to eq(0)
      @creator.create_concept(@child)
      expect(Concept.count).to eq(@creator.concepts.length)
      nchild = Concept.find_by_name("Greece")
      nparent = Concept.find_by_name("Capitalization")
      ngrandparent = Concept.find_by_name("Alphabet")
      expect(nchild.parent).to eq(nparent)
      expect(nparent.parent).to eq(ngrandparent)
    end
  end
end
