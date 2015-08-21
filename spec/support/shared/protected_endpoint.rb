shared_examples_for 'protected endpoint' do
  before do
    subject
  end

  it 'requires an OAuth access token' do
    expect(response.status).to eq(401)
  end
end