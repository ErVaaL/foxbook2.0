require 'rails_helper'

RSpec.describe "Api::V1::Groups", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/api/v1/groups/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/api/v1/groups/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/api/v1/groups/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/api/v1/groups/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/api/v1/groups/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /members" do
    it "returns http success" do
      get "/api/v1/groups/members"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /add_member" do
    it "returns http success" do
      get "/api/v1/groups/add_member"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /remove_member" do
    it "returns http success" do
      get "/api/v1/groups/remove_member"
      expect(response).to have_http_status(:success)
    end
  end

end
