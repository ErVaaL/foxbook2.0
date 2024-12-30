FactoryBot.define do
  factory :user do
    first_name { 'John' }
    last_name { 'Doe' }
    username { 'johndoe' }
    age { 20 }
    phone { '123456789' }
    email { 'john.doe@example.com' }
    password { 'password' }
    password_confirmation { 'password' }
  end
end
