# TODO: Enhance User Registration with Plan Selection

## Backend Changes
- [x] Add 'plan' field to userModel.js (enum: 'free', 'premium', default: 'free')
- [x] Update registerUser in userController.js to accept and store plan

## Frontend Changes
- [x] Add plan selection dropdown to signup form in Login.jsx
- [x] Update registration API call to include plan

## Premium Features
- [x] Show plan in Navbar dropdown
- [ ] Add medicine suggestion chatbot for premium users
- [ ] Add video calling option for premium users in appointment booking

## Testing
- [ ] Test registration with free plan
- [ ] Test registration with premium plan
- [ ] Verify plan is stored in database
- [ ] Test premium features
