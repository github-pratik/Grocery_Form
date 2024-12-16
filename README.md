# Collaborative Grocery List App

A real-time collaborative grocery list application built with React and Firebase.

## Features

- Real-time updates across all connected users
- Google Authentication
- Push notifications for list updates
- Responsive design for mobile and desktop
- Mark items as completed/uncompleted
- Clean and intuitive user interface

## Tech Stack

- React
- TypeScript
- Firebase (Authentication, Firestore, Cloud Messaging)
- TailwindCSS
- React Router
- React Hot Toast

## Setup Instructions

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable Google Authentication:
     - Go to Authentication > Sign-in methods
     - Enable Google sign-in provider
   - Set up Firestore Database:
     - Go to Firestore Database
     - Create database in test mode

2. **Get Firebase Configuration**:
   - Go to Project Settings (gear icon) > General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register your app
   - Copy the configuration values

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_VAPID_KEY=your_vapid_key
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Firebase Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groceries/{item} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

