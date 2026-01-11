# Vercel Deployment Guide for Fastbreak Events

## Prerequisites
- Vercel account (free tier works)
- GitHub/GitLab/Bitbucket account
- Supabase project already set up

## Deployment Steps

### 1. Push Code to Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Fastbreak Events application"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as default)

### 3. Configure Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Important**: Update `NEXT_PUBLIC_APP_URL` after deployment with your actual Vercel URL.

### 4. Deploy

Click "Deploy" - Vercel will build and deploy your application.

### 5. Post-Deployment Configuration

#### Update Supabase Auth Settings

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to:
   - Site URL: `https://your-project.vercel.app`
   - Redirect URLs:
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/**`

#### Configure Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase Dashboard → Authentication → Providers:
   - Enable Google
   - Add Client ID and Secret

## Monitoring & Analytics

Vercel provides:
- Real-time logs
- Performance analytics
- Error tracking
- Deployment history

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment-Specific Builds

For staging/production environments:

```json
// vercel.json (optional)
{
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node version compatibility

### Auth Issues
- Confirm redirect URLs in Supabase
- Check environment variables
- Verify CORS settings

### Database Connection
- Ensure Supabase project is active
- Check service role key permissions
- Verify RLS policies

## Continuous Deployment

Vercel automatically deploys:
- Production: Every push to `main` branch
- Preview: Every pull request

## Performance Optimization

Vercel automatically provides:
- Edge caching
- Image optimization
- Code splitting
- Static generation where possible

## Security Checklist

✅ Never commit `.env.local` file
✅ Use Vercel's environment variables
✅ Keep service role key secret
✅ Enable Vercel's DDoS protection
✅ Set up proper CORS headers

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

Your app is now live! 🚀