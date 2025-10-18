# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Portfolio Machine

Simple portfolio builder — create multi-page portfolios, edit pages/sections (HTML), manage assets and export static sites.

Features
- Create multiple portfolios and pages with ordered sections (HTML).
- WYSIWYG or raw HTML editing (use TipTap/Quill/your editor).
- Local autosave (IndexedDB) + persisted metadata (localStorage via zustand).
- Asset management (store file IDs/URLs; use proxy for Drive if needed).
- Export to ZIP / static HTML for hosting (Netlify, GitHub Pages).

Getting started (local)
1. Install
   npm install

2. Run dev server
   npm start
   Open http://localhost:3000

3. Build for production
   npm run build
   Serve the build folder or deploy to Netlify/Vercel.

Environment
- Use `.env.local` for local-only build-time values. Example:
  REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec
- Do NOT commit `.env.local`.

Deploy (Netlify)
- Push repo to GitHub.
- Create a new site on Netlify from the repo.
- Build command: `npm run build`
- Publish directory: `build`
- For SPA routing, add `public/_redirects` with:
  ```
  /*    /index.html   200
  ```

Data & backups
- Metadata is persisted to localStorage. Large page bodies and drafts are stored in IndexedDB (autosave).
- Use the Export button in the app to download a ZIP/JSON backup.

Contributing
- Fork, implement changes, open a PR.
- Keep assets out of localStorage; use IndexedDB or external storage.

License
- MIT

Notes
- Sanitize HTML before publishing (DOMPurify recommended).
- If using Google Drive for assets, add an Apps Script proxy to avoid cross-origin/embed restrictions.
