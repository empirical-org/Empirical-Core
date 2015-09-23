require 'rails_helper'

describe 'FullnameGenerator' do

  let!(:name1) { "John Smith" }
  let!(:name2) { "John" }
  let!(:name3) { "  John"}
  let!(:name4) { "John "}
  let!(:name5) { "  " }
  let!(:name6) { nil }
  let!(:corrected) { "John John" }
  let!(:default_name) { "Firstname Lastname" }


  def generate name
    FullnameGenerator.new(name).generate
  end

  it 'does not change a name that is already full' do
    new_name = generate(name1)
    expect(new_name).to eq(name1)
  end

  it 'does change a name that is not full' do
    new_name = generate(name2)
    expect(new_name).to eq(corrected)
  end

  it 'handles useless spaces in front' do
    new_name = generate(name3)
    expect(new_name).to eq(corrected)
  end

  it 'handles useless spaces in back' do
    new_name = generate(name4)
    expect(new_name).to eq(corrected)
  end

  it 'handles empty names' do
    new_name = generate(name5)
    expect(new_name).to eq(default_name)
  end

  it 'handles nil names' do
    new_name = generate(name6)
    expect(new_name).to eq(default_name)
  end
end
