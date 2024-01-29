# sakha
Sakha is a restaurant management application having multiple functionalities. Which makes Sakha an extra ordinary tool to ease out my dream.

## Functionalities
- User Management
  - User Creation [admin, outlet manager, waiter]
  - User Listing/Filter/Search
  - User Profile
  - User Edit/Delete
- Authentication
  - User Login
  - User Sign Up [oAuth, email, phone] [captcha]
  - User Forgot Password
  - User Reset Password
  - User Logout
- Authorization/Role management
  - Role Creation
  - Role List/Filter/Search 
  - Role Edit/Delete
- Outlet Management
  - Outlet Creation
  - Outlet List/Filter/Search
  - Outlet Edit/Delete
- Menu management [Via QR Code/Dashboard]
  - Menu List/Filter/Search
  - Menu Creation
  - Menu Edit/Delete
- Order Management
  - Order List/Filter/Search [new/preparing/delivered] [Outlet wise/all]
  - Create Order [Via QR Code/Dashboard]
  - Edit/Delete Order
- Customers Data
  - Add Customer [Via order/manual]
  - List/Filter/Search Customer
  - Edit/Delete Customer
- Expense Management
  - Expense List/Filter/Search
  - Expense Creation
  - Expense Edit/Delete
- Feedback Management
  - Feedback List/Filter/Search
  - Feedback Creation
  - Feedback Delete
- Notification/History Management
  - Notification List/Filter/Search
  - Notification Creation
  - Notification Delete
- Offers
  - Offers List/Filter/Search
  - Offers Creation
  - Offers Delete
- Dashboard
  - Profit Listing [Day/Month/Year]
  - Accumulated info cards
  - Analytics Graph
    - Order
    - Profit
    - Expense

## Modules

### Users
- Schema [firstName, lastName, phone, email, roleId, outletId, profilePic, documentProof, salary, DOJ, DOE, password, isActive, createdAt, createdBy, updatedAt, updatedBy]
- Salary History [User wise]

### Roles
- Schema [roleName, permissions, createdAt, createdBy, updatedAt, updatedBy]

### Outlets
- Schema [address, city, state, postalCode, openingDate, createdAt, createdBy, updatedAt, updatedBy]

### Menu
- Schema [name, cuisine[Indian/Italian], subcuisine[South Indian], pricing[object(qtr/half/full)], ingredients[array], dishType[Veg/Non Veg], isCombo, category[main course/starter/beverage/dessert/bread/rice], subCategory[], subItems[array], isGravyDish, taste[spicy/sweet], isBestSeller, description, createdAt, createdBy, updatedAt, updatedBy]

### Orders
- Schema [items, bill[GST, serviceCharge, vat], customerDetails[name,phone], outletId, totalBill, totalTax, discount, offerId, orderStatus[new/preparing/complete/cancelled], feedbackMessage, feedbackStars, createdAt, updatedAt, createdBy, updatedBy]

### Customers
- Schema [name, phone, orderCount, outletVisited[array], lastVisitedAt]

### Expense
- Schema [category[salary, maintenance, purchase], subcategory[], items, outletId, amount, description, createdAt, createdBy, updatedAt, updatedBy]

### Feedback
- Schema [customerName, stars, description, orderId, outletId, createdAt]

### Notification
- Schema [category, descrpition, outletId, createdAt, createdBy]

### Offers
- Schema [name, code, details[object], outletId, description, expiry, createdAt, createdBy, updatedAt, updatedBy]



Doubts - 
- Authorization 
  - Route level [done]
  - Resource level [?]
