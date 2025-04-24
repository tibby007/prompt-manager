# Vercel Deployment Instructions for Prompt Manager App

## Overview
This document provides step-by-step instructions for deploying the Prompt Manager application to Vercel. Vercel is a cloud platform for static sites and serverless functions that works perfectly with Next.js applications.

## Prerequisites
1. A GitHub, GitLab, or Bitbucket account
2. A Vercel account (you can sign up at https://vercel.com using your GitHub/GitLab/Bitbucket account)

## Deployment Steps

### Option 1: Deploy from GitHub Repository

1. **Push the code to GitHub**
   - Create a new repository on GitHub
   - Initialize Git in the project folder (if not already done):
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/prompt-manager.git
     git push -u origin main
     ```

2. **Deploy to Vercel**
   - Go to https://vercel.com and sign in
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: next build
     - Output Directory: .next
   - Click "Deploy"

### Option 2: Deploy from Local Files

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the Application**
   - Navigate to the project directory
   ```bash
   cd prompt-manager-app
   vercel
   ```
   - Follow the prompts to configure your deployment
   - When asked about settings, use the following:
     - Project name: prompt-manager
     - Framework preset: Next.js
     - Root directory: ./
     - Build command: next build
     - Output directory: .next

## Environment Variables

For the application to work correctly, you'll need to set up the following environment variables in your Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:
   - `DATABASE_URL`: Your database connection string (if using an external database)

## Database Setup

The application uses Cloudflare D1 for database storage. To set up the database:

1. Create a D1 database in your Cloudflare account
2. Run the SQL migration file (migrations/0001_initial_fixed.sql) to create the necessary tables
3. Update the wrangler.toml file with your database details

## Custom Domain (Optional)

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly installed
3. Verify that environment variables are properly set
4. Check that the database is accessible from Vercel

## Maintenance and Updates

To update your application after making changes:

1. Push changes to your GitHub repository (if using Option 1)
2. Vercel will automatically rebuild and deploy the updated application
3. Or, if using the CLI (Option 2), run `vercel` again from your project directory

## Support

If you need further assistance with deployment:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Cloudflare D1 Documentation: https://developers.cloudflare.com/d1/
