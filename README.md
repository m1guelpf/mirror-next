# A Next.js-powered frontend for your Mirror blog

> This project mimics the [Mirror](https://mirror.xyz) publication design and pulls data from their APIs, allowing you to self-host your Mirror blog on a custom domain.

You can view a demo of this project by visiting [m1guelpf.blog](https://m1guelpf.blog), which hosts the [my Mirror publication](https://miguel.mirror.xyz).

## Features

-   [x] Article list
-   [x] Article page
-   [x] Code highlighting (using VSCode's rendering engine, allows for custom themes. Currently using `github-light` and `github-dark`, depending on the publication's theme)
-   [x] Dark mode (when enabled on Mirror)
-   [x] Patience page (when no articles exist)
-   [x] Static generation (all pages should load instantly once deployed)
-   [x] Static re-generation (new articles should appear without re-deploying)
-   [x] Embeds
    -   [x] Tweet embeds
    -   [x] YouTube embeds
    -   [x] Additional embeds (CodePen, JSBin, Gists, etc., not sure if supported by Mirror already)
    -   [x] NFT embeds
    -   [x] Bookmark cards (Open Graph)
-   [x] Email list support (when enabled on Mirror)
-   [x] Pull content from Arweave
-   [x] Write Mirror entry about this project

## Development

-   Clone this repo in a local directory
-   Install dependencies (`pnpm install`)
-   Copy the `.env.example` file to `.env.local`, and fill in your mirror subdomain and an RPC URL
-   Start the server! (`pnpm dev`)

## Deploying to Vercel

You can deploy this project to Vercel (and load your own publication!) by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fm1guelpf%2Fmirror-next&env=NEXT_PUBLIC_AUTHOR_ENS,NEXT_PUBLIC_RPC_URL&envDescription=The%20ENS%20for%20the%20publication%20you%20want%20to%20load%2C%20and%20an%20RPC%20URL.&project-name=mirror-next&repo-name=mirror-next)

Once it's ready, you should be able to attach your custom domain from the Vercel settings page.

## FAQ

**Is this decentralized?**

Kind of. While I'm pulling the entry listing and contents from the Arweave chain directly, the publication details come from Mirror's APIs.

**Why did you make this?**

I like playing with stuff :). I really like Mirror's design, so I decided to create a [Ghost](https://ghost.org) theme "inspired" by their design. Once that was finished, I decided to turn that theme into something slightly more useful.

**Who are you?**

:wave: Hi! I'm [Miguel Piedrafita](https://twitter.com/m1guelpf), an 22-year-old maker. You can follow my journey and all the little things I make on the way [on Twitter](https://twitter.com/m1guelpf).

**I have another question**

Read [Building apps with Mirror](https://m1guelpf.blog/post/building-apps-with-mirror), an entry I wrote in my own Mirror publication explaining how this project works, and how you can build your own Mirror apps. If you still have questions after that, [drop me a line on Twitter](https://twitter.com/m1guelpf).

## License

This project is open-sourced software licensed under the MIT license. See the [License file](LICENSE.md) for more information.
