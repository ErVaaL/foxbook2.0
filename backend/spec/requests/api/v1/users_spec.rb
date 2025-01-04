require 'rails_helper'

RSpec.describe "Users API", type: :request do
  let(:valid_attributes) do
    {
      user: {
        first_name: "Jane",
        last_name: "Doe",
        username: "jane_doe",
        email: "jane.doe@example.com",
        phone: "123456789",
        password: "password123",
        password_confirmation: "password123"
      }
    }
  end

  let(:invalid_attributes) do
    {
      user: {
        first_name: "",
        last_name: "",
        email: "invalid_email",
        username: "short",
        age: 10,
        phone: "123456789",
        password: "short",
        password_confirmation: "mismatch"
      }
    }
  end

  describe "POST /api/v1/users/register" do
    context "with valid parameters" do
      it "creates a new user" do
        expect {
          post "/api/v1/users/register", params: valid_attributes, as: :json
        }.to change(User, :count).by(1)
      end

      it "returns a created response with a token" do
        valid_attributes[:user][:email] = "new_email@example.com"

        post "/api/v1/users/register", params: valid_attributes, as: :json
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json).to have_key("token")
        expect(json["message"]).to eq("User registered successfully")
      end
    end

    context "with invalid parameters" do
      it "does not create a new user" do
        expect {
          post "/api/v1/users/register", params: invalid_attributes, as: :json
        }.to_not change(User, :count)
      end

      it "returns an unprocessable entity response" do
        post "/api/v1/users/register", params: invalid_attributes, as: :json
        expect(response).to have_http_status(:bad_request)
        json = JSON.parse(response.body)
        expect(json).to have_key("error")
        expect(json["error"]).to eq("Failed to create user")
      end
    end
  end
end
