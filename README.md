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
- Schema [firstName, lastName, phone, email, roleId, profilePic, documentProof, salary, DOJ, DOE, password, isActive, createdAt, createdBy, updatedAt, updatedBy]
- Salary History [User wise]

### Roles
- Schema [roleName, permissions, createdAt, createdBy, updatedAt, updatedBy]

### Outlets
- Schema [outletOwner, outletManager, address, city, state, postalCode, openingDate,  , createdAt, createdBy, updatedAt, updatedBy]

### Members
- Schema [userId, userName, roleId, roleName, designation, outletId, isActive]

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

### Expenditure
- Schema []

Doubts - 
- Authorization 
  - Route level [done]
  - Resource level [?]
- get update, delete user [role rank based authorization]

Todo -
- Need to make middleware to upload user profile pic & document
- Need to centralize all role ids to env file
- Nothing



* Features -
- Take away, dine in both will be applicable
- There will be web & mobile application for the admin panel
- There will be an order generating app as well via QR code
- oAuth authentication system as well

* Modules -

USERS -
- name
- designation [admin, subadmin, outlet manager, waiter, cook, watchman, helper, receptionist,cleaner]
- phone
- email
- documents
- outlet_ids
- salary
- profile_pic
- address
- role_id
- role_name
- user_name
- password

OUTLET DETAILS -
- address
- policy
- opening_date
- owner_id
- outlet_email
- outlet_phone
- documents
- opening_time
- closing_time
- is_open
- is_active

LOGS -
- updated_by
- updated_at
- description
- fields_updated
- old_record
- new_record
- updated_id
- module_name

DISH CATEGORY -
- name
- is_active
- outlet_id
- created/updated timestamp

DISH SUBCATEGORY -
- name
- is_active
- outlet_id
- created/updated timestamp

DISH -
- name
- type [veg/non-veg]
- cuisine [Indian, Italian, Chinese]
- regional_cuisine [South Indian, North Indian]
- category_id
- subcategory_id
- dish_taste [spicy, sweet, sour]
- ingredients
- price [quarter, half, full]
- description
- outlet_id
- created_by
- created_at

KOT -
- bill_no
- table_no
- item_details [name, quantity]
- description
- timestamp

REVIEW -
- order_id
- customer_id
- description
- rating
- timestamp

CUSTOMER -
- name
- phone
- timestamp

OFFER -
- outlet_id
- name
- on_dish
- dish_id
- offer_type [flat, percent, flat & percent, bogo]
- offer_detail [min_value, max_value, min_percent, max_percent, paid_dish_count, free_dish_count]
- description
- offer_expiry
- is_active
- timestamp

ORDER -
- outlet_id
- item_details [name, quantity, price]
- kot_ids
- bills [sub_total, total_discount, cgst_tax, sgst_tax, service_charge, packaging_charge, delivery_charge, pay_price]
- applied_offer_ids
- customer_id
- review_id
- is_dine_in
- status [pending, completed, cancelled]
- timestamp

VENDOR -
- outlet_ids
- name
- email
- phone
- timestamp

EXPENDITURE -
- name
- quantity
- price_per_item
- total_price
- outlet_id
- purchased_date
- timestamp

EXPENSE -
- title
- description
- expense_type [expenditure, maintenance, salary, inventory, tax]
- user_id
- outlet_id
- timestamp