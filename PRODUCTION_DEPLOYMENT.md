# Production Deployment Guide

## Common Production Issues and Solutions

### Admin Login Redirect Not Working

If admin login redirects aren't working in production, check the following:

#### 1. Session Cookie Configuration

The application now includes fixes for production deployment:

- **Trust Proxy**: Added `app.set('trust proxy', 1)` to trust reverse proxies
- **Session Save**: Sessions are explicitly saved before redirect
- **Cookie Settings**: Configured for production environments

#### 2. Environment Variables

Add these to your production `.env` file:

```env
NODE_ENV=production
BEHIND_PROXY=true  # Set to false if not behind a reverse proxy (nginx, etc.)
SESSION_SECRET=your-very-secure-secret-key-here
```

#### 3. Reverse Proxy Configuration

If you're using nginx or another reverse proxy, ensure:

**Nginx Configuration:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**Important Headers:**
- `X-Forwarded-Proto`: Tells Express if the original request was HTTPS
- `X-Forwarded-For`: Client's real IP address
- `Host`: Original host header

#### 4. HTTPS Configuration

If your site uses HTTPS:

1. **Behind Proxy (Recommended)**:
   - Proxy handles SSL termination
   - Set `BEHIND_PROXY=true` in `.env`
   - Cookies will be secure automatically

2. **Direct HTTPS**:
   - Node.js handles SSL directly
   - Set `BEHIND_PROXY=false` in `.env`
   - Ensure `secure: true` in cookie settings

#### 5. Session Store

Ensure MongoDB connection is working:
- Check `MONGODB_URI` is correct
- Verify MongoDB is accessible from production server
- Check network/firewall rules

#### 6. Debugging Steps

1. **Check Session Creation**:
   ```javascript
   // Add to authController.js temporarily
   console.log('Session after login:', req.session);
   ```

2. **Check Cookie Headers**:
   - Use browser DevTools → Network tab
   - Check Set-Cookie header in response
   - Verify cookie is being set

3. **Check Redirect**:
   - Verify redirect URL is correct
   - Check for any middleware blocking redirect
   - Look for CORS issues

4. **Check Logs**:
   - Look for "Session save error" messages
   - Check MongoDB connection errors
   - Verify session store is working

#### 7. Common Issues

**Issue: Redirect loops**
- **Cause**: Session not being saved/read correctly
- **Fix**: Ensure `req.session.save()` is called before redirect

**Issue: Cookies not set**
- **Cause**: Secure flag mismatch or SameSite issues
- **Fix**: Adjust cookie settings based on your setup

**Issue: Session lost after redirect**
- **Cause**: Session store not persisting
- **Fix**: Verify MongoDB connection and MongoStore configuration

**Issue: 401/403 errors**
- **Cause**: Authentication middleware not recognizing session
- **Fix**: Check session data structure matches middleware expectations

#### 8. Testing in Production

1. Test login flow:
   ```bash
   # Check if session is created
   # Check if redirect happens
   # Check if dashboard loads
   ```

2. Test session persistence:
   ```bash
   # Login
   # Navigate to different pages
   # Check if still authenticated
   ```

3. Test logout:
   ```bash
   # Logout
   # Try accessing protected route
   # Should redirect to login
   ```

## Additional Production Considerations

### Security

1. **Session Secret**: Use a strong, random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` file
4. **Rate Limiting**: Consider adding rate limiting for login attempts

### Performance

1. **Session Store**: MongoDB sessions are stored in database
2. **Connection Pooling**: Configure MongoDB connection pooling
3. **Caching**: Consider Redis for sessions in high-traffic scenarios

### Monitoring

1. Monitor session creation failures
2. Track login success/failure rates
3. Monitor MongoDB connection health
4. Set up alerts for authentication errors

## Quick Fix Checklist

- [ ] `NODE_ENV=production` in `.env`
- [ ] `BEHIND_PROXY` set correctly
- [ ] `SESSION_SECRET` is strong and unique
- [ ] Reverse proxy configured correctly (if used)
- [ ] MongoDB connection working
- [ ] HTTPS enabled (if required)
- [ ] Cookie settings match your setup
- [ ] Trust proxy enabled in Express

## Support

If issues persist:
1. Check server logs for errors
2. Verify all environment variables
3. Test session creation manually
4. Check browser console for errors
5. Verify network requests in DevTools

