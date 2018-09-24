require 'rails_helper'

describe ValidateFullName do
  it 'returns failure when first name or last name is blank' do
    names = { first_name: "first", last_name: '' }

    result = described_class.new(names).call

    expect(result).to eq({
      status: "failed",
      notice: "Please provide both a first name and a last name."
    })
  end

  it 'returns failure when first or last name contains space' do
    names = { first_name: "first with spaces", last_name: "last with spaces" }

    result = described_class.new(names).call

    expect(result).to eq({
      status: "failed",
      notice: "Names cannot contain spaces."
    })
  end

  it 'capitalizes first and last name' do
    names = { first_name: "first", last_name: "last" }

    result = described_class.new(names).call

    expect(result).to eq({first_name: "First", last_name: "Last"})
  end

  it 'should strip the white spaces' do
    names = { first_name: " First ", last_name: " Last " }

    result = described_class.new(names).call

    expect(result).to eq({ first_name: "First", last_name: "Last" })
  end
end
