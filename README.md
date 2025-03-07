# Code Cuisine - Restaurant Booking system!

## Table of content for README.
1. Project Overview
2. Agile Workflow
3. MVC Structure
4. Features
5. Testing
6. Technologies Used
7. Lighthouse Performance scores
8. Deployment to Heroku
9. Screenshots
10. Credits and Resources
11. Details

## Project Overview

Code Cuisine is a fully functional restaurant website featuring a booking system that allows customers to reserve tables online, and view menu options and also allows staff to manage bookings. This project adheres to Agile methodology and follows MVC framework principles.

### Main pages:

- Home Page - Displays restaurant details and location.
- Menu Page - Showcases food and drinks.
- Booking Page - Allows customers to reserve and cancel their table.
- Admin Page - A secure page that allows staff to manage bookings.

## Agile Workflow

The development process was dynamic and adaptive, making room for continuous improvements along the way. Instead of rigidly planning everything upfront, features were built in small, manageable stages, tested frequently, and adjusted while testing. This ensured that the final product was as functional and user-friendly as possible.

I used Trello to help me keep on track with my projects with me making certain tasks more of a priority.

![Screenshot of the cards in Trello](screenshots\trello_all_cards_displayed.png)

I also added comments below to help me understand what was needed for each feature.

![Screenshot of comment inside card to explain what i need to do](screenshots\trello_comment.png)


## MVC Structure

This project is structured in a way that users input their data from the interface, It is then processed through controlled logic, and finally stored and retrived in a database.

Customers will enter their details on the booking page.
![Screenshot of booking Page](screenshots\booking-style.png)

for it all to be stored in the data base.
![Screenshot of database layout](screenshots\db-layout.png)

collected and displayed on the admin page for admins to make changes if needed
![Screenshot of admin page](screenshots\admin-modify.png)


## Features
1. Table Reservation.
    - ![Screenshot of successful booking](screenshots\successfull_booking_popup.png)
2. Real-Time Availability.
    - The system updates as bookings are placed and prevents double bookings.
3. Booking status update.
    - ![Screenshot of admin dashboard](screenshots\booking-display-admin.png)
    - Admins can mark customers and arrived or left and delete bookings if required.
4. Form Validation.
    - ![Screenshot of invalid email popup](screenshots\invalid-email-popup.png)
    - Also ensure all fields are filled.
5. Menu Display.
    - ![Screenshot of menu display](screenshots\food-menu.png)
6. Secure admin page.
    - ![Screenshot of Admin login page](screenshots\admin-login-style.png)


## Testing

I manually tested all features to ensure proper responses and along side that i also did some unit testing to ensure the features work as intended.

### JavaScript Booking testing 
![Screenshot of booking part 1 of js testing](screenshots\booking-js-testing.png)
![Screenshot of booking part 2 of js testing](screenshots\booking-js-testing-pt2.png)

### JavaScript Admin testing
![Screenshot of admin testing](screenshots\admin-js-testing.png)

### Python testing
![Screenshot of python testing OK](screenshots\python-testing-pass.png)

## Technologies Used

### For my front end code i used:
  - HTML5
  - CSS3
  - Bootstrap 4
  - JavaScript

### For my back end i used:
  - Python
  - Flask
  - SQLAlchemy

### For Tools and Libraries i used :
  - GitHub
  - Flask API
  - Lighthouse
  - Pycodestyle (for python validating)
  - W3C Validator


  ## Lighthouse Performance scores 

  1. Index.html
![Screenshot of the index Lighthouse](screenshots\index-lighthouse-score.png)

  2. Menu.html
![Screenshot of the menu page Food](screenshots\menu-lighthouse-score.png)


  3. Booking.html
![Screenshot of page 1 booking](screenshots\booking-lighthouse-score.png)

  4. Admin.html
![screenshot of admin login](screenshots\admin-lighthouse-score.png)

## Deployment to Heroku

awaiting support


## Screenshots


  1. Index.html
![Screenshot of the index page](screenshots\index-page.png)

  2. Menu.html
    - Food menu
![Screenshot of the menu page Food](screenshots\food-menu.png)
    -  Drinks menu
![Screenshot of the menu page Drinks](screenshots\drinks-menu.png)

  3. Booking.html
    - Page 1
![Screenshot of page 1 booking](screenshots\page-1-booking.png)
    - Page 2
![Screenshot of page 2 booking](screenshots\page-2-booking.png)
    - Page 3
![Screenshot of page 3 booking](screenshots\page-3-booking.png)

  4. Admin.html
    - Login page
![screenshot of admin login](screenshots\admin-login-style.png)
    - Admin dashboard
![screenshot of admin dashboard](screenshots\admin-dashboard.png)

## Details
  - ### Jon Williams
  - ### [Github](https://github.com/JonOwenWilliams)
  - ### [Github Repository](https://github.com/JonOwenWilliams/Code_Cuisine)
