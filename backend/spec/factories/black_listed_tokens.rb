FactoryBot.define do
  factory :black_listed_token do
    token { "MyString" }
    user { nil }
  end
end
