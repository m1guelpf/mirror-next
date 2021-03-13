# A Next.js-powered frontend for your Mirror blog
> This project mimics the [Mirror](https://mirror.xyz) publication design and pulls data from their APIs, allowing you to self-host your Mirror blog on a custom domain.

## Features

- [x] Article list
- [x] Article page
- [x] Code highlighting (using VSCode's rendering engine, allows for custom themes. Currently using `github-light` and `github-dark`, depending on the publication's theme)
- [x] Dark mode (when enabled on Mirror)
- [x] Patience page (when no articles exist)
- [x] Static generation (all pages should load instantly once deployed)
- [x] Static re-generation (new articles should appear without re-deploying)
- [ ] Embeds
    - [x] Tweet embeds
    - [x] YouTube embeds
    - [x] Additional embeds (CodePen, JSBin, Gists, etc., not sure if supported by Mirror already)
    - [ ] OpenGraph embeds
    - [ ] NFT embeds (couldn't find a page to test, but should be easy to add)
    - [ ] NFT crowdfunding
- [x] Email list support (when enabled on Mirror)
- [ ] Get into mirror :wink:

## Development

- Clone this repo in a local directory
- Install dependencies (`yarn install` or `npm install`)
- Update the ENS address of the Mirror blog you want to load on `app.config.js`
- Start the server! (`yarn dev` or `npm run dev`)

## Deploying to Vercel

If you've followed the development guide above, you should commit your changes and push them to a fork of this repo. If you just want to deploy, you can fork it from GitHub and edit the `app.config.js` file to point to your Mirror publication.

Then, [create a new Vercel project](https://vercel.com/new) and choose your newly-created repository. Select your Vercel team, and click `Deploy`.

Once it's ready, you should be able to attach your custom domain from the Vercel settings page.

## FAQ

**Is this decentralized?**

Not really. I'm getting the data from Mirror's APIs instead of querying Arweave directly. If they ever decide to add some kind of authentication to their API (or contact me saying they'd rather I don't use it), I'll move to querying Arweave, and then it'll be more decentralized.

**Why did you make this?**

I like playing with stuff :). I really like Mirror's design, so I decided to create a [Ghost](https://ghost.org) theme "inspired" by their design. Once that was finished, I decided to turn that theme into something slightly more useful.

**Who are you?**

:wave: Hi! I'm [Miguel Piedrafita](https://twitter.com/m1guelpf), an 18-year-old indie maker, getting his toes deep into crypto. You can follow my journey and all the little things I make on the way [on Twitter](https://twitter.com/m1guelpf)

**I have another question**

Vote for me on the next [$WRITE Race](https://mirror.xyz/race) and I'll write a longer article about how I found their APIs and a few other cool things related to building this project.

## License

This project is open-sourced software licensed under the MIT license. See the [License file](LICENSE.md) for more information.
