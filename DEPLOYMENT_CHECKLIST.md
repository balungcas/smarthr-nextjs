# 🚀 Deployment Checklist for SmartHR

Use this checklist before deploying to production.

## Pre-Deployment Checklist

### 1. Code & Configuration

- [ ] All code committed to Git
- [ ] `.env.local` not committed (verify .gitignore)
- [ ] `package.json` has correct name and version
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] All dependencies up to date
- [ ] Remove console.logs from production code
- [ ] Remove debug code and comments

### 2. Environment Variables

- [ ] All required environment variables documented
- [ ] `.env.example` updated with all variables
- [ ] Production environment variables prepared
- [ ] No hardcoded secrets in code
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL
- [ ] `NODE_ENV` set to "production"

### 3. Supabase Setup

- [ ] Database migrations executed successfully
- [ ] All tables created (verify in Table Editor)
- [ ] RLS policies enabled on all tables
- [ ] RLS policies tested for each role
- [ ] Storage buckets created (avatars, documents, receipts)
- [ ] Storage policies configured correctly
- [ ] Default data seeded (leave types, salary components)
- [ ] Test users created for each role
- [ ] Auth redirect URLs configured
- [ ] Email templates customized (optional)

### 4. Stripe Configuration

- [ ] Stripe account switched to live mode (when ready)
- [ ] Live API keys obtained
- [ ] Test payments working in test mode
- [ ] Webhook endpoint URL prepared
- [ ] Webhook secret obtained
- [ ] Webhook events configured:
  - [ ] payment_intent.succeeded
  - [ ] payment_intent.payment_failed
  - [ ] invoice.paid
- [ ] Payment flows tested thoroughly
- [ ] Refund process tested

### 5. Resend (Email) Configuration

- [ ] Domain verified in Resend
- [ ] DNS records added and verified
- [ ] API key obtained
- [ ] Email templates tested
- [ ] Sender email configured correctly
- [ ] Test emails sent successfully
- [ ] Email deliverability tested
- [ ] SPF/DKIM records verified

### 6. Netlify Configuration

- [ ] Site created in Netlify
- [ ] Repository connected
- [ ] Build settings configured:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `.next`
- [ ] All environment variables added
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate enabled (auto with Netlify)
- [ ] Deploy previews enabled
- [ ] Branch deploys configured

### 7. Testing

#### Authentication
- [ ] User registration works
- [ ] Email verification works (if enabled)
- [ ] Login works for all roles
- [ ] Logout works
- [ ] Password reset works
- [ ] Session persistence tested
- [ ] Protected routes working
- [ ] Role-based access working

#### Core Features
- [ ] Create/view/edit/delete departments
- [ ] Create/view/edit/delete employees
- [ ] Submit leave requests
- [ ] Approve/reject leaves (as manager/admin)
- [ ] Create clients
- [ ] Create projects
- [ ] Assign tasks
- [ ] Generate invoices
- [ ] Process payments via Stripe
- [ ] Upload files (avatars, documents)
- [ ] Email notifications sending

#### Cross-browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

#### Performance
- [ ] Page load times acceptable
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] No memory leaks

### 8. Security

- [ ] All API endpoints secured
- [ ] RLS policies prevent unauthorized access
- [ ] Input validation working (Zod schemas)
- [ ] File upload restrictions in place
- [ ] CORS configured correctly
- [ ] Security headers set (check netlify.toml)
- [ ] No sensitive data exposed in responses
- [ ] Error messages don't reveal system details
- [ ] Rate limiting considered (Netlify has built-in)

### 9. Documentation

- [ ] README.md updated
- [ ] SETUP_GUIDE.md reviewed
- [ ] API documentation complete
- [ ] User guide created (optional)
- [ ] Admin guide created (optional)
- [ ] Troubleshooting guide updated
- [ ] Changelog maintained

### 10. Monitoring & Backup

- [ ] Supabase database backups enabled
- [ ] Monitoring setup (Netlify Analytics)
- [ ] Error tracking configured (optional: Sentry)
- [ ] Logging reviewed
- [ ] Alerts configured for critical errors
- [ ] Performance monitoring enabled

### 11. Legal & Compliance

- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] Cookie policy (if using cookies)
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy defined
- [ ] User data export functionality (optional)

### 12. Launch Preparation

- [ ] Staging environment tested
- [ ] Beta users invited (optional)
- [ ] Feedback collected and addressed
- [ ] Final QA passed
- [ ] Rollback plan prepared
- [ ] Support channels ready
- [ ] Marketing materials ready (if applicable)

---

## Deployment Steps

### Step 1: Final Code Push

```bash
git add .
git commit -m "Production ready v1.0"
git push origin main
```

### Step 2: Netlify Deployment

1. Trigger deploy in Netlify dashboard
2. Monitor build logs
3. Wait for deployment to complete
4. Verify deployment URL

### Step 3: Stripe Webhook Configuration

1. Add webhook endpoint in Stripe dashboard
2. Copy webhook secret
3. Add to Netlify environment variables
4. Trigger redeploy

### Step 4: DNS Configuration (if using custom domain)

1. Add DNS records as per Netlify instructions
2. Wait for DNS propagation (can take 24-48 hours)
3. Verify SSL certificate issued

### Step 5: Post-Deployment Verification

1. Test all critical user flows
2. Verify email delivery
3. Test payment processing
4. Check error logs
5. Monitor performance

### Step 6: User Communication

1. Notify users of new system
2. Provide login credentials
3. Share user guide
4. Offer support

---

## Post-Deployment Checklist

### Immediate (First 24 Hours)

- [ ] Monitor error logs closely
- [ ] Check email delivery rate
- [ ] Monitor payment transactions
- [ ] Be available for user support
- [ ] Fix any critical bugs immediately

### First Week

- [ ] Collect user feedback
- [ ] Monitor system performance
- [ ] Review security logs
- [ ] Check database size and growth
- [ ] Address non-critical issues

### First Month

- [ ] Review analytics and usage patterns
- [ ] Optimize based on real-world usage
- [ ] Update documentation based on feedback
- [ ] Plan feature improvements
- [ ] Review and optimize costs

---

## Rollback Plan

If critical issues occur:

### Option 1: Quick Fix
```bash
git revert <commit-hash>
git push origin main
# Netlify auto-deploys
```

### Option 2: Rollback in Netlify
1. Go to Deploys tab
2. Find last working deployment
3. Click "Publish deploy"

### Option 3: Database Rollback
1. Go to Supabase dashboard
2. Database → Backups
3. Restore to previous snapshot

---

## Support Contacts

Keep these handy during launch:

- **Supabase Support**: support@supabase.io
- **Netlify Support**: support@netlify.com
- **Stripe Support**: support@stripe.com
- **Resend Support**: support@resend.com

---

## Success Metrics to Monitor

- [ ] User registration rate
- [ ] Login success rate
- [ ] Page load times
- [ ] API response times
- [ ] Error rate (should be < 1%)
- [ ] Payment success rate
- [ ] Email delivery rate
- [ ] User satisfaction (surveys)

---

## Common Launch Issues

### Issue: High Error Rate
- Check Netlify function logs
- Verify environment variables
- Check Supabase connection

### Issue: Slow Performance
- Check database indexes
- Review API calls (too many?)
- Enable caching

### Issue: Emails Not Sending
- Verify Resend API key
- Check domain verification
- Review email logs

### Issue: Payments Failing
- Verify Stripe keys (live vs test)
- Check webhook configuration
- Review Stripe logs

---

## Final Go/No-Go Decision

Review all checkboxes above. If any critical items are unchecked:

**🔴 DO NOT DEPLOY**

If all critical items checked:

**🟢 READY TO DEPLOY!**

---

**Good luck with your launch! 🚀**

Remember: It's better to delay launch and fix issues than to launch with critical bugs.
