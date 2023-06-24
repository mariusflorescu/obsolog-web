# Obsolog - Dead simple monitoring tool

## Prerequisites

- Node.js (>= v16)
- pnpm (`rpm install -g pnpm`)

## Installing the dependencies

The dependencies are being install by typing the `pnpm install` in the terminal.

## Environment variables

Create a file `.env` at the root of the project, with the following information:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_KEY_HERE
CLERK_SECRET_KEY=YOUR_KEY_HERE
CLERK_WEBHOOK_KEY=YOUR_KEY_HERE
DATABASE_URL=YOUR_KEY_HERE
UPSTASH_REDIS_REST_URL=YOUR_KEY_HERE
UPSTASH_REDIS_REST_TOKEN=YOUR_KEY_HERE=
STRIPE_SECRET_KEY=YOUR_KEY_HERE
STRIPE_SIGNING_SECRET=YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_KEY_HERE
```

### Notes

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` are from creating a project in Stripe
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are from creating a new project in Clerk
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are from creating a new Redis instance in Upstash
- `STRIPE_SIGNING_SECRET` and `CLERK_WEBHOOK_KEY` are for the webhooks

## Running the project

To run the project, input the following command: `pnpm run dev`
Now, the project should be seen on your [localhost](http://localhost:3000).
