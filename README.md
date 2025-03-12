# foxbook2.0

## 1. Introduction

The application is a prototype of social network app, based on the idea of Facebook.
Created as a project for the course "Web Applications" of the Department of Informatics of Polish-Japanese Academy of Information Technology.

## 2. Technologies

- Ruby on Rails
- MongoDB
- Vite/React.js
- TailwindCSS
- Phoenix

## 3. Installation

1. Clone the repository
2. In each directory (backend, frontend, chat) install dependencies: backend - bundle install, frontend - npm install, chat - mix deps.get
3. Build mongo database with docker-compose up -d --build
4. Run backend with `rails s`
5. Run frontend with `npm run dev`
6. Run chat with `mix phx.server`

## 4. Features

- User accounts, authentication, authorization
- Posts, comments, likes
- Chat
- Notifications
- Friend requests
- User profiles
- Groups, events
- Search groups, events, users
- Admin panel
- Selecting app theme
