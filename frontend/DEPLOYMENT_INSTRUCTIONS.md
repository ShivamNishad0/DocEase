# Deployment Instructions for DocEase Frontend on Netlify

This document provides step-by-step instructions to deploy the DocEase frontend project to Netlify.

## Prerequisites
- Ensure your project is pushed to a GitHub repository.
- Have a Netlify account. Sign up at https://app.netlify.com/ if you don't have one.

## Deploying via GitHub Integration

1. Log in to your Netlify account.
2. Click on **"New site from Git"**.
3. Connect your GitHub account and authorize Netlify.
4. Select the repository containing the DocEase project.
5. In the **Build settings**:
   - Set **Base directory** to `frontend`
   - Set **Build command** to `npm run build`
   - Set **Publish directory** to `dist`
6. Click **Deploy site**.
7. Wait for the build and deployment process to complete.
8. Your site will be live at the generated Netlify URL.

## Deploying via Manual Upload

1. Open a terminal and navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to build the project.
4. After the build completes, locate the `dist` folder inside `frontend`.
5. Log in to your Netlify account and go to the **Sites** page.
6. Drag and drop the `dist` folder onto the Netlify dashboard to deploy.
7. Your site will be live at the generated Netlify URL.

## Notes

- The `netlify.toml` file in the `frontend` directory configures Netlify to use the correct build command and publish directory.
- Ensure environment variables (if any) are configured in Netlify dashboard under Site Settings > Build & Deploy > Environment.
- For connecting the frontend to the deployed backend, set the environment variable `VITE_BACKEND_URL` in Netlify to your backend API URL.
  - Go to your site on Netlify dashboard.
  - Navigate to Site Settings > Build & Deploy > Environment.
  - Add a new variable `VITE_BACKEND_URL` with the value of your backend API URL.
    For example: `https://docease-cdd2.onrender.com`
  - Redeploy the site after setting the variable.

**Important:** Since the backend URL has changed to `https://docease-cdd2.onrender.com`, please update the environment variable in Netlify accordingly and redeploy the frontend site to ensure proper connection.

If you need further assistance or automation scripts, please let me know.
