require 'rails_helper'

describe IpLocationWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }

    before do
      allow(Pointpin).to receive(:locate) {
        {
          "country_name" => "country",
          "region_name" => "region",
          "city_name" => "city",
          "postcode" => "110011",
        }
      }
    end

    it 'should create the ip location unless the location is in the given blacklist' do
      subject.perform(user.id, "some_ip", [])
      expect(IpLocation.last.country).to eq "country"
      expect(IpLocation.last.state).to eq "region"
      expect(IpLocation.last.city).to eq "city"
      expect(IpLocation.last.zip).to eq 110011
      expect(IpLocation.last.user).to eq user
    end

    it 'should not create the ip location if it is in the given blacklist' do
      subject.perform(user.id, "some_ip", ["110011"])
      expect(IpLocation.count).to eq 0
    end
  end
end
