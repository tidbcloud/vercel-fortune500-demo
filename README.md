## Getting Started

First, create a `.env.local` file in the root folder with given environment variables, you can get them in TiDBCloud's web console.

This project relies on TiDB Cloud's Data API service, look at your data api settings, you can find a the data api endpoint like `https://data.tidbcloud.com/api/v1beta/apps/chat2query-[YOUR_DATA_API_ID]/v1/chat2data`, **only copy `YOUR_DATA_API_ID` but not the full url**, to the env file, alongside with `api-key` and the cluster id, like below:

```env
TIDBCLOUD_API_ID=YOUR_DATA_API_ID
TIDBCLOUD_API_KEY=YOUR_DATA_API_KEY
TIDBCLOUD_CLUSTER_ID=YOUR_CLUSTER_ID
```

Then you can use the Vercel integration or manually inject those variables so this project can talk to your database directly:

```env
TIDB_HOST=gateway.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=USER
TIDB_PASSWORD=PASSWORD
TIDB_DATABASE=DB
```

Next, it is optional and only if you want to dig deeper and change the database scheme design, then you will need to add another variable named `DATABASE_URL`, it's just url composed of those variables above: `mysql://[TIDB_USER]:[TIDB_PASSWORD]@[TIDB_HOST]:[TIDB_PORT]/[TIDB_DATABASE]?pool_timeout=60&sslaccept=accept_invalid_certs`, then you can sync your local dev database with the remote with `npx prisma db push`.

Install the dependencies:

```bash
npm install
# or
yarn install
# or preferred
pnpm install
```

Generate database client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Basic Auth

If you want to deploy your own clone and also protect the page from being visited by the public, we also provided a simple basic access authentication solution. You'll need to add two more environment variables in your `.env.local` and the Vercel dashboard. Don't use a simple passphrase like below, replace `admin` with your own one: 

```env
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSPHRASE=admin
```

Then re-deploy, all your pages will be protected, and they can only be accessed with correct user and passphrase!

## Learn More

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftidbcloud%2Fvercel-fortune500-demo&env=TIDBCLOUD_API_ID,TIDBCLOUD_API_KEY,TIDBCLOUD_CLUSTER_ID&envDescription=You%20can%20get%20them%20in%20the%20setting%20of%20chat2query%20in%20TiDBCloud's%20web%20console)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on Netlify

[![Deploy to Netlify button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tidbcloud/vercel-fortune500-demo)

1. Click the **Deploy to Netlify** button.
2. Click **Connect to GitHub** and authenticate your GitHub account.
3. Fill in **Repository name** for your own GitHub repository.
4. Enter the environment variables:
    - `TIDBCLOUD_API_ID`: The TiDB Cloud chart2chart data api id.
    - `TIDBCLOUD_API_KEY`: The TiDB Cloud data api key.
    - `TIDBCLOUD_CLUSTER_ID`: TiDB Cloud cluster ID.
5. Click **Save & Deploy**.

