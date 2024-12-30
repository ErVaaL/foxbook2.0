require 'rails_helper'

RSpec.describe "Api::V1::FriendRequests", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/api/v1/friend_requests/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/api/v1/friend_requests/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/api/v1/friend_requests/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/api/v1/friend_requests/destroy"
      expect(response).to have_http_status(:success)
    end
  end
end
