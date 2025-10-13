# DocEase

A comprehensive healthcare management platform that connects patients with doctors, streamlines appointment booking, and provides administrative tools for healthcare providers.

## 🚀 Features

### For Patients
- **User Registration & Authentication**: Secure signup and login with JWT tokens
- **Doctor Discovery**: Browse doctors by specialty with detailed profiles
- **Appointment Booking**: Easy online appointment scheduling with real-time availability
- **Medicine Suggestion Chatbot**: AI-powered symptom-based medicine recommendations
- **Profile Management**: Update personal information and view appointment history
- **Payment Integration**: Secure payments via Stripe and Razorpay
- **Video Call Support**: Integrated video consultation capabilities

### For Doctors
- **Doctor Dashboard**: Manage appointments, availability, and earnings
- **Profile Management**: Update professional information and specialties
- **Appointment Management**: View and manage scheduled appointments
- **Patient Records**: Access patient information and appointment history

### For Administrators
- **Admin Dashboard**: Comprehensive overview of platform metrics
- **Doctor Management**: Add, edit, and manage doctor profiles
- **Appointment Oversight**: Monitor all appointments across the platform
- **Analytics**: Track earnings, appointments, and user statistics

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **React Router**: Declarative routing for React applications
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing for security
- **Multer**: Middleware for handling file uploads

### External Services
- **Cloudinary**: Cloud-based image storage and management
- **Stripe**: Payment processing platform
- **Razorpay**: Indian payment gateway integration

## 🏗 Architecture

DocEase follows a microservices architecture with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Admin Panel   │
│   (React)       │◄──►│   (Node/Express)│◄──►│    (React)      │
│                 │    │                 │    │                 │
│ - Patient UI    │    │ - REST API      │    │ - Admin UI      │
│ - Booking       │    │ - Authentication│    │ - Management    │
│ - Medicine Bot  │    │ - Database Ops  │    │ - Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    MongoDB      │
                    │   Database      │
                    └─────────────────┘
```

### Key Components:
- **Frontend**: Patient-facing application built with React
- **Backend**: RESTful API server handling business logic
- **Admin Panel**: Administrative interface for managing the platform
- **Database**: MongoDB for storing users, doctors, appointments, and other data

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/en/download/)
- **MongoDB** - [Download](https://www.mongodb.com/)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Stripe Account** (Optional) - [Sign up](https://stripe.com/)
- **Razorpay Account** (Optional) - [Sign up](https://razorpay.com/)

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and configure the following:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

   # Stripe (Optional)
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Razorpay (Optional)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Port
   PORT=4000
   ```

4. **Setup MongoDB:**
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/)
   - Create a new project and database
   - Choose `M0` free tier and select your region
   - Set up a username and password (Avoid using `@` in passwords)
   - Whitelist IP `0.0.0.0/0`
   - Click on `Connect` > Select `Compass` > Copy the connection string
   - Paste the connection string into the `.env` file and replace `<password>` with your actual password

5. **Setup Cloudinary:**
   - Create an account at [Cloudinary](https://cloudinary.com/)
   - Copy `Cloud Name`, `API Key`, and `API Secret` from the dashboard
   - Add these values to the `.env` file

6. **Setup Payment Gateways (Optional):**
   - **Stripe:** Get the `Secret Key` from your Stripe dashboard
   - **Razorpay:** Get `Key ID` and `Key Secret` from your Razorpay dashboard

7. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Admin Panel Setup

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the admin panel:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5174](http://localhost:5174) in your browser.

## 📖 Usage

### For Patients
1. **Register/Login**: Create an account or sign in to access the platform
2. **Browse Doctors**: View doctors by specialty and read their profiles
3. **Book Appointments**: Select a doctor, choose an available time slot, and book
4. **Manage Appointments**: View upcoming appointments and appointment history
5. **Use Medicine Bot**: Get medicine suggestions based on symptoms
6. **Update Profile**: Manage personal information and preferences

### For Doctors
1. **Login**: Access the doctor dashboard with credentials
2. **Manage Availability**: Set available time slots
3. **View Appointments**: See scheduled appointments and patient details
4. **Update Profile**: Modify professional information and specialties

### For Administrators
1. **Login**: Access the admin panel
2. **Dashboard Overview**: Monitor platform statistics and metrics
3. **Manage Doctors**: Add new doctors, edit profiles, manage listings
4. **Monitor Appointments**: View all appointments across the platform

## 🔗 API Endpoints

### User Routes
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/appointments` - Get user appointments

### Doctor Routes
- `POST /api/doctor/login` - Doctor login
- `GET /api/doctor/profile` - Get doctor profile
- `GET /api/doctor/appointments` - Get doctor appointments
- `POST /api/doctor/update-profile` - Update doctor profile

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard data
- `POST /api/admin/add-doctor` - Add new doctor
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/appointments` - Get all appointments

## 🌐 Deployment

### Frontend Deployment (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Live URL: [https://doceasee.netlify.app/](https://doceasee.netlify.app/)

### Backend Deployment (Render)
- Live URL: [https://docease-cdd2.onrender.com](https://docease-cdd2.onrender.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@docease.com or join our Discord community.

## 🙏 Acknowledgments

- Thanks to all contributors and the open-source community
- Special thanks to the healthcare professionals who provided insights for this platform
