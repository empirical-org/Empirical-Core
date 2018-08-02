require 'rails_helper'

describe GenerateFullname do
  it 'does not change fullnames' do
    name = 'John Smith'

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq(name)
  end

  it 'handles mononymous names' do
    name = 'John'

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq('John John')
  end

  it 'removes leading spaces from mononymous names' do
    name = '  John'

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq('John John')
  end

  it 'removes trailing spaces from from mononymous names' do
    name = 'John  '

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq('John John')
  end

  it 'returns default name for empty names' do
    name = '  '

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq('Firstname Lastname')
  end

  it 'returns default name for nil names' do
    name = nil

    new_name = GenerateFullname.new(name).call

    expect(new_name).to eq('Firstname Lastname')
  end
end
