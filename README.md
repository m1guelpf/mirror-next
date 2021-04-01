# A Next.js-powered frontend for your Mirror blog

> This project mimics the [Mirror](https://mirror.xyz) publication design and pulls data from their APIs, allowing you to self-host your Mirror blog on a custom domain.

You can view a demo of this project by visiting [mirror.m1guelpf.me](https://mirror.m1guelpf.me), which hosts the [my Mirror publication](https://miguel.mirror.xyz).

## Features

-   [x] Article list
-   [x] Article page
-   [x] Code highlighting (using VSCode's rendering engine, allows for custom themes. Currently using `github-light` and `github-dark`, depending on the publication's theme)
-   [x] Dark mode (when enabled on Mirror)
-   [x] Patience page (when no articles exist)
-   [x] Static generation (all pages should load instantly once deployed)
-   [x] Static re-generation (new articles should appear without re-deploying)
-   [ ] Embeds
    -   [x] Tweet embeds
    -   [x] YouTube embeds
    -   [x] Additional embeds (CodePen, JSBin, Gists, etc., not sure if supported by Mirror already)
    -   [ ] OpenGraph embeds
    -   [ ] NFT embeds (couldn't find a page to test, but should be easy to add)
    -   [ ] NFT crowdfunding
    -   [ ] NFT auctions
-   [x] Email list support (when enabled on Mirror)
-   [x] Pull content from Arweave
-   [ ] Write Mirror entry about this project

## Development

-   Clone this repo in a local directory
-   Install dependencies (`yarn install` or `npm install`)
-   Copy the `.env.example` file to `.env.local`, and fill in your mirror subdomain and your [Infura Project ID](https://infura.io/dashboard/ethereum)
-   Start the server! (`yarn dev` or `npm run dev`)

## Deploying to Vercel

You can deploy this project to Vercel (and load your own publication!) by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fm1guelpf%2Fmirror-next&env=ENS_DOMAIN,INFURA_ID&envDescription=The%20Mirror%20subdomain%20the%20publication%20you%20want%20to%20load%2C%20and%20a%20free%20Infura%20project%20ID.&project-name=mirror-next&repo-name=mirror-next)

Once it's ready, you should be able to attach your custom domain from the Vercel settings page.

## FAQ

**Is this decentralized?**

Kind of. While I'm pulling the article listing and contents from the Arweave chain directly, the publication and contributor details come from Mirror's APIs.

**Why did you make this?**

I like playing with stuff :). I really like Mirror's design, so I decided to create a [Ghost](https://ghost.org) theme "inspired" by their design. Once that was finished, I decided to turn that theme into something slightly more useful.

**Who are you?**

:wave: Hi! I'm [Miguel Piedrafita](https://twitter.com/m1guelpf), an 18-year-old indie maker, getting his toes deep into crypto. You can follow my journey and all the little things I make on the way [on Twitter](https://twitter.com/m1guelpf).

**I have another question**

I'll be writing an article about this project in [my brand new Mirror publication](https://miguel.mirror.xyz) soon!

## License

This project is open-sourced software licensed under the MIT license. See the [License file](LICENSE.md) for more information.
