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

# 🎨 Professional Portfolio Application

A modern, full-featured portfolio website built with React 19, featuring a Google Apps Script backend for data management, professional UI/UX, and dark mode support.

## ✨ Features

### 🎯 Core Features
- **Professional Portfolio Showcase** - Projects, education, work experience, references, and blog posts
- **Dark/Light Mode** - Fully themed UI with smooth transitions
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Multi-language Support** - i18next integration (English, Chinese, Malay, Thai)
- **State Management** - Zustand with persistence and DevTools
- **Google Sheets Backend** - Data stored in Google Sheets via Apps Script API

### 📱 Pages
- **Home** - Hero section with featured projects
- **Projects** - Grid view of all projects with detail pages
- **Education** - Timeline view of educational background
- **Work Experience** - Professional experience showcase
- **References** - Contact cards with recommendations
- **Blog** - Article list with featured images
- **Dashboard** - Admin overview with statistics (protected)
- **Users** - User management table (protected)

### 🔐 Authentication
- Protected routes for admin features
- Persistent login state
- Role-based access control

### 🎨 Design System
- Professional sky/slate color palette
- Consistent theme tokens across all components
- Custom UI for each entity type
- Loading and empty states
- Professional typography and spacing

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 16
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd my-portfolio1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Google Apps Script URL:
```env
REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

4. **Deploy Google Apps Script**
   - Open Google Sheets and create a new spreadsheet
   - Go to Extensions > Apps Script
   - Copy the contents of `google-apps-script/Code.gs`
   - Deploy as a web app (Execute as: Me, Who has access: Anyone)
   - Copy the deployment URL to your `.env` file

5. **Start development server**
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── api/              # API configuration (Google Apps Script)
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── auth/        # Authentication components
│   └── layout/      # Layout components (Header, Layout)
├── context/         # React Context providers (Auth, Theme, Toast)
├── pages/           # Page components (Home, Projects, etc.)
├── services/        # API service layer (6 entity services)
├── store/           # Zustand store and slices
│   └── slices/     # State slices for each entity
└── utils/          # Utility functions
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router 6** - Client-side routing
- **Zustand** - State management with persistence
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalization
- **React Icons** - Icon library

### Backend
- **Google Apps Script** - Serverless backend
- **Google Sheets** - Database
- **Google Drive** - Image storage

## 📝 Available Scripts

```bash
# Development
npm start          # Start dev server (http://localhost:3000)
npm test          # Run tests
npm run build     # Build for production
npm run eject     # Eject from Create React App (one-way)
```

## 🎨 Theme System

The application uses a comprehensive theme system with dark/light mode:

```javascript
const { colors, isDark, toggleTheme } = useTheme()

// Available color tokens:
colors.text.primary    // Main text
colors.text.secondary  // Secondary text
colors.text.muted      // Muted text
colors.background.primary    // Main background
colors.background.secondary  // Card backgrounds
colors.button.primary        // Primary buttons
colors.button.secondary      // Secondary buttons
colors.border                // Borders
```

## 🔌 API Integration

All data is managed through Google Apps Script. The service layer provides:

### Services
- `projectsService` - Projects CRUD operations
- `blogsService` - Blog posts management
- `educationsService` - Education records
- `workService` - Work experience
- `referencesService` - References
- `userService` - User management

### Example Usage
```javascript
import usePortfolioStore from './store/store'

function MyComponent() {
  const projects = usePortfolioStore(s => s.projects)
  const fetchProjectsRemote = usePortfolioStore(s => s.fetchProjectsRemote)
  
  useEffect(() => {
    fetchProjectsRemote()
  }, [])
}
```

## 🚀 Deployment

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add environment variable: `REACT_APP_APPS_SCRIPT_URL`
5. Add `_redirects` file for SPA routing:
```
/*    /index.html   200
```

### Vercel
1. Import project from GitHub
2. Framework Preset: Create React App
3. Add environment variable: `REACT_APP_APPS_SCRIPT_URL`
4. Deploy

## 📦 Data Management

### Storage
- **Zustand Store** - Persisted to localStorage
- **Google Sheets** - Backend database with sheets:
  - Users, projects, educations, workExperiences, references, blogs

### Image Uploads
- Images stored in Google Drive
- URLs returned and saved with records
- Automatic proxy for cross-origin access

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- React team for React 19
- Tailwind CSS for the styling framework
- Google for Apps Script platform
- Zustand for simple state management
