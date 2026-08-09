# BETORA Deployment

## Frontend (Vercel)
1. Connect GitHub repo
2. Root: `frontend`, Build: `npm run build`
3. Env: `NEXT_PUBLIC_API_URL`

## Backend (Railway/Render)
1. Root: `backend`
2. Env: all from `.env.example`

## Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 4000
CMD ["node","dist/main.js"]
```

## Production Checklist
- [ ] DEMO_MODE=false
- [ ] Real DB/Redis credentials
- [ ] Strong JWT secrets (64+ chars)
- [ ] SSL/TLS enabled
- [ ] CORS configured for prod
- [ ] Sports data provider connected
- [ ] Payment provider connected
- [ ] KYC provider connected
- [ ] Email provider configured
- [ ] DB backups configured
- [ ] Monitoring set up