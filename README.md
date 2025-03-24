# DocEase

## Setup & Run Instructions

### Prerequisites
- Install [Node.js](https://nodejs.org/en/download/) (Ignore if already installed)
- Install [MongoDB](https://www.mongodb.com/)
- Create an account on [Cloudinary](https://cloudinary.com/)
- (Optional) Create an account on [Stripe](https://stripe.com/) for payments
- (Optional) Create an account on [Razorpay](https://razorpay.com/) for payments

---

## Backend Setup

1. Open the project folder in VS Code.
2. Open the integrated terminal.
3. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. **Setup Cloudinary:**
   - Create an account at [Cloudinary](https://cloudinary.com/)
   - Copy `Cloud Name`, `API Key`, and `API Secret` from the dashboard
   - Add these values to the `.env` file in the backend folder

6. **Setup MongoDB:**
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/)
   - Create a new project and database
   - Choose `M0` free tier and select your region
   - Set up a username and password (Avoid using `@` in passwords)
   - Whitelist IP `0.0.0.0/0`
   - Click on `Connect` > Select `Compass` > Copy the connection string
   - Paste the connection string into the `.env` file and replace `<password>` with your actual password

7. **(Optional) Setup Stripe:**
   - Create an account at [Stripe](https://stripe.com/)
   - Get the `Stripe Secret Key` from the dashboard
   - Add it to the `.env` file

8. **(Optional) Setup Razorpay:**
   - Create an account at [Razorpay](https://razorpay.com/)
   - Get `Razorpay Secret Key` and `Key ID` from the dashboard
   - Add them to the `.env` file

9. Start the backend server:
   ```sh
   npm run server
   ```

---

## Frontend Setup

1. Open the `frontend` folder in VS Code.
2. Open the integrated terminal.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## Admin Panel Setup

1. Open the `admin` folder in VS Code.
2. Open the integrated terminal.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the admin panel:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:5174` in your browser.

---

## Troubleshooting
If you face any issues, you can contact us on Instagram: [@greatstackdev](https://instagram.com/greatstackdev)

Find More Projects: [GreatStack](https://greatstack.dev/source-code)

