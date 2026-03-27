# Birdy
Social media platform prototype
using express server on localhost as an web application
react ui with a slick and luxury feel and minimalist style (no gradient colours)

features
- login page - with account creation and forgotten password functions
- user feed page which will have a feed of what other users have posted
- users can create a "chirp" which is a post/message for other users to see in the feed
- users can see other users chirps and comment on them, like them or dislike them
- users can follow other users (this will increases the users followers and following respectively)
- create an admin account to delete users, monitor and see users
- user page where a user can see their account profile and change to public/private this will change so that other users who dont follow them cannot see their feed/posts

## Screenshots

### Login Page
![Birdy Login Page](https://github.com/user-attachments/assets/b02188fc-9a99-42a6-9d6d-6863d7524a0c)

## Test Accounts

The following accounts are seeded automatically when the server starts (development mode only):

| Username | Email               | Password   | Role  |
|----------|---------------------|------------|-------|
| admin    | admin@birdy.com     | Admin1234! | Admin |
| alice    | alice@birdy.com     | Test1234!  | User  |
| bob      | bob@birdy.com       | Test1234!  | User  |
| charlie  | charlie@birdy.com   | Test1234!  | User  |

Standards
- all functionality should be tested in a folder called tests these tests will use jest and be seperated into there own files within the folder for readability
- the use of a layered architecture should be intergrated and met with presentation layer, bussiness layer and data layer each layer should be cohesive
- add meaningful documentaion to the code and create a folder called documentaion to hold all the documentation files
- security should be top priority, run penatraion tests and ensure private data is safe and secure
- ensure Test driven development is met
- code should be written in the sense of flexability and maintainability
- program should be able to run fast for a better user experience 
