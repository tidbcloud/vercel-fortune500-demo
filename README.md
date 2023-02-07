## Getting Started

First, create a `.env.local` file in the root folder with given environment variables, you can get them in the setting of chat2query in TiDBCloud's web console:

```env
TIDBCLOUD_URL=https://data.tidbcloud.com/api/v1beta/apps/[YOUR_DATAAPI_ENDPOINT]/v1/chat2chart
TIDBCLOUD_API_KEY=YOUR_DATA_API_KEY
TIDBCLOUD_DB=YOUR_DATABASE_NAME
TIDBCLOUD_CLUSTER_ID=YOUR_CLUSTER_ID
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or preferred
pnpm install
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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftidbcloud%2Fvercel-fortune500-demo&env=TIDBCLOUD_URL,TIDBCLOUD_API_KEY,TIDBCLOUD_DB,TIDBCLOUD_CLUSTER_ID&envDescription=You%20can%20get%20them%20in%20the%20setting%20of%20chat2query%20in%20TiDBCloud's%20web%20console)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on Netlify

[![Deploy to Netlify button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tidbcloud/vercel-fortune500-demo)

1. Click the **Deploy to Netlify** button.
2. Click **Connect to GitHub** and authenticate your GitHub account.
3. Fill in **Repository name** for your own GitHub repository.
4. Enter the environment variables:
    - `TIDBCLOUD_URL`: The TiDB Cloud chart2chart data api url.
    - `TIDBCLOUD_API_KEY`: The TiDB Cloud data api key.
    - `TIDBCLOUD_DB`: TiDB Cloud Database Name.
    - `TIDBCLOUD_CLUSTER_ID`: TiDB Cloud cluster ID.
5. Click **Save & Deploy**.

