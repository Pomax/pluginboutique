What a fairly straight forward single-file PluginBoutique "account" page could look like. See [https://pomax.github.io/pluginboutique](https://pomax.github.io/pluginboutique) for the live demo.

This was a react-react-app app, but that's kind of a weird thing to use these days, honestly. So the "real" version I use for my own overview uses esbuild+preact rather than the overkill that is babel+webpack+react these days.

Clone this, then drop your own data in as a filed called `src/protected/formatted.json`, and run things with `npm start` (after a one-time `npm install`).

(Note that you may need to run this with Node 16 because I wrote this years ago and Node changed its TLS/OpenSSL implementation since then, so I'm pretty sure newer versions of Node won't work. Then again, you installed Node using https://github.com/nvm-sh/nvm or https://github.com/coreybutler/nvm-windows anyway, right? ...right?)

Engage with me: [https://mastodon.social/@TheRealPomax](https://mastodon.social/@TheRealPomax)
