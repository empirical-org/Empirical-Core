require 'rails_helper'

describe Api::V1::TitleCardsController, type: :controller do
  let(:staff) { create(:staff) }
  let(:title_card) { create(:title_card) }

  describe "#index" do
    it 'should render TitleCard objects if they exist' do
      # Persist the factory-generated TitleCard so that .all works in the controller
      title_card.save
      get :index, params: { title_card_type: 'connect_title_card' }
      expect(response.status).to eq(200)
      expect(response.body).to include(title_card.uid)
      expect(response.body).to include(title_card.content)
      expect(response.body).to include(title_card.title)
    end

    it 'should render an empty array if no TitleCards exist' do
      title_card.delete
      get :index, params: { title_card_type: 'connect_title_card' }
      expect(response.status).to eq(200)
      expect(response.body).to eq('{"title_cards":[]}')
    end
  end

  describe "#show" do
    it 'should render the requested TitleCard object if it exists' do
      get :show, params: { title_card_type: 'connect_title_card', id: title_card.uid }
      expect(response.status).to eq(200)
      expect(response.body).to include(title_card.uid)
      expect(response.body).to include(title_card.content)
      expect(response.body).to include(title_card.title)
    end

    it 'should return a 404 if the requested TitleCard is not found' do
      get :show, params: { title_card_type: 'connect_title_card', id: 'doesnotexist' }
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update" do
    before { @request.session['user_id'] = staff.id }

    it 'should update the specified TitleCard if all data is valid and return it' do
      new_content = 'updated content'

      put :update,
        params: { 
          title_card_type: 'connect_title_card', 
          id: title_card.uid, 
          title_card: {
            content: new_content
          }
        }

      expect(response.status).to eq(200)
      expect(title_card.reload.content).to eq(new_content)
    end

    it 'should 404 NOT FOUND if the provided UID does not match a known TitleCard' do
      put :update, 
        params: { 
          title_card_type: 'connect_title_card', 
          id: 'doesnotexist' 
        }

      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it 'should 422 UNPROCESSABLE ENTITY if the posted data is invalid' do
      invalid_content = nil

      put :update, 
        params: { 
          title_card_type: 'connect_title_card', 
          id: title_card.uid, 
          title_card: {
            content: invalid_content
          }
        }

      expect(response.status).to eq(422)
      expect(response.body).to match(/content.*can't be blank/)
    end

    it 'should 422 UNPROCESSABLE ENTITY if the provided UID already belongs to an existing TitleCard' do
      used_uid = SecureRandom.uuid
      create(:title_card, uid: used_uid)
      put :update, 
        params: { 
          title_card_type: 'connect_title_card', 
          id: title_card.uid, 
          title_card: {
            uid: used_uid
          }
        }

      expect(response.status).to eq(422)
      expect(response.body).to match(/uid.*has already been taken/)
    end

    # Disabling these security tests until we figure out a way to secure the
    # endpoints
    #it 'should 403 FORBIDDEN if a non-staff user calls it' do
    #  @request.session['user_id'] = nil
    #  put :update, title_card_type: 'connect_title_card', id: title_card.uid
    #  expect(response.status).to eq(403)
    #  expect(response.body).to eq('Only available to authorized "staff" users')
    #end
  end

  describe "#create" do
    let(:create_params) do
      {
        uid: SecureRandom.uuid,
        content: "Newly created content",
        title: "Newly created title"
      }
    end

    before { @request.session['user_id'] = staff.id }

    it 'should create a new TitleCard if all data is valid and return it' do
      post :create, 
        params: {
          title_card_type: 'connect_title_card', 
          title_card: create_params
        }

      expect(response.status).to eq(200)
      expect(TitleCard.find_by(uid: create_params[:uid])).not_to be_nil
    end

    it 'should provide a UID automatically if we do not set one explicitly' do
      post :create, 
        params: { 
          title_card_type: 'connect_title_card', 
          title_card: create_params.except(:uid)
        }

      expect(response.status).to eq(200)
      expect(response.body).to include(create_params[:content])
      expect(response.body).to include(create_params[:title])
    end

    it 'should 422 UNPROCESSABLE ENTITY if the posted data is invalid' do
      post :create, 
        params: {
          title_card_type: 'connect_title_card', 
          title_card: create_params.except(:content)
        }

      expect(response.status).to eq(422)
      expect(response.body).to match(/content.*can't be blank/)
    end

    it 'should 422 UNPROCESSABLE ENTITY if the provided UID already belongs to an existing TitleCard' do
      post :create, 
        params: {
          title_card_type: 'connect_title_card', 
          title_card: create_params.update(uid: title_card.uid)
        }

      expect(response.status).to eq(422)
      expect(response.body).to match(/uid.*has already been taken/)
    end

    # Disabling these security tests until we figure out a way to secure the
    # endpoints
    #it 'should 403 FORBIDDEN if a non-staff user calls it' do
    #  @request.session['user_id'] = nil
    #  post :create, title_card_type: 'connect_title_card'
    #  expect(response.status).to eq(403)
    #  expect(response.body).to eq('Only available to authorized "staff" users')
    #end
  end

  # Disabling destroy endpoints since we've turned them off while we don't have
  # any auth in place
  #describe "#destroy" do
  #  before do
  #    @request.session['user_id'] = staff.id
  #  end

  #  it 'should delete TitleCards if found' do
  #    delete :destroy, title_card_type: 'connect_title_card', id: title_card.uid
  #    expect(response.status).to eq(200)
  #    expect(TitleCard.find_by(uid: title_card.uid)).to eq(nil)
  #  end

  #  it 'should 404 NOT FOUND if no TitleCard with the provided UID is found' do
  #    delete :destroy, title_card_type: 'connect_title_card', id: 'doesnotexist'
  #    expect(response.status).to eq(404)
  #    expect(response.body).to include("The resource you were looking for does not exist")
  #  end

  #  # Disabling these security tests until we figure out a way to secure the
  #  # endpoints
  #  #it 'should 403 FORBIDDEN if a non-staff user calls it' do
  #  #  @request.session['user_id'] = nil
  #  #  delete :destroy, title_card_type: 'connect_title_card', id: title_card.uid
  #  #  expect(response.status).to eq(403)
  #  #  expect(response.body).to eq('Only available to authorized "staff" users')
  #  #end
  #end
end
