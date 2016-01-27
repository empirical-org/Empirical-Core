require 'rails_helper'

describe IpLocationWorker, type: :worker do
  let(:worker) { IpLocationWorker.new }
  let(:teacher) { FactoryGirl.create(:teacher) }

  # TODO: make a vcr recording of this


  # it 'uses Pointpin API to get zip, country, state, and city of user' do
  #   ip_address = '74.125.224.72' #google's address
  #   worker.perform(teacher.id, ip_address)
  #   binding.pry
  #   expect(teacher.ip_location).to eq('a')
  # end

  # it 'does not return a location for ip addresses where the zip is 10005' do
  #   ip_address = '74.125.224.72'
  #   worker.perform(teacher.id, ip_address)
  #   binding.pry
  #   expect(teacher.ip_location).to eq('a')
  # end
end
