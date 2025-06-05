# Remote-Next

A fullstack remote job board with authentication, filtering, paid listings, and admin dashboard.

## Features
- Sign up / Login via Clerk
- Job listing with filtering (remote, search)
- Post free or paid job listings (Stripe)
- Admin dashboard to moderate jobs/users

## Setup

1. Clone repo  
2. Setup PostgreSQL and update DATABASE_URL  
3. Add your Stripe and Clerk keys in `.env.local`  
4. Install dependencies: `npm install`  
5. Run migrations: `npx prisma migrate dev`  
6. Run dev server: `npm run dev`

---

## Next Steps

- Add email notifications  
- Improve admin dashboard UX  
- Add job application feature  
- Integrate payments webhooks

---

