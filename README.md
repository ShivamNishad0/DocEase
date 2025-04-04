DocEase
Setup & Run Instructions
Prerequisites
Install Node.js (Ignore if already installed)
Install MongoDB
Create an account on Cloudinary
(Optional) Create an account on Stripe for payments
(Optional) Create an account on Razorpay for payments
Backend Setup
Open the project folder in VS Code.

Open the integrated terminal.

Navigate to the backend folder:

cd backend
Install dependencies:

npm install
Setup Cloudinary:

Create an account at Cloudinary
Copy Cloud Name, API Key, and API Secret from the dashboard
Add these values to the .env file in the backend folder
Setup MongoDB:

Create an account at MongoDB Atlas
Create a new project and database
Choose M0 free tier and select your region
Set up a username and password (Avoid using @ in passwords)
Whitelist IP 0.0.0.0/0
Click on Connect > Select Compass > Copy the connection string
Paste the connection string into the .env file and replace <password> with your actual password
(Optional) Setup Stripe:

Create an account at Stripe
Get the Stripe Secret Key from the dashboard
Add it to the .env file
(Optional) Setup Razorpay:

Create an account at Razorpay
Get Razorpay Secret Key and Key ID from the dashboard
Add them to the .env file
Start the backend server:

npm run server
Frontend Setup
Open the frontend folder in VS Code.
Open the integrated terminal.
Install dependencies:
npm install
Start the frontend:
npm run dev
Open http://localhost:5173 in your browser.
Admin Panel Setup
Open the admin folder in VS Code.
Open the integrated terminal.
Install dependencies:
npm install
Start the admin panel:
npm run dev
Open http://localhost:5174 in your browser.
Troubleshooting
If you face any issues, you can contact us on Instagram: @greatstackdev

Find More Projects: GreatStack