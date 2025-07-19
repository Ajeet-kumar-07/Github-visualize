# GitHub Visualizer

An interactive GitHub visualizer with a dashboard, 3D repo map, and shareable portfolio card.

## ✨ Features

- **Interactive Dashboard**: View GitHub profile statistics with animated charts
- **3D Repository Map**: Explore repositories in an interactive 3D space using Three.js
- **Modern, Animated UI**: Beautiful gradients, smooth transitions, and interactive feedback
- **Shareable Portfolio Card**: (Temporarily disabled)
- **Real-time Data**: Fetches live data from GitHub API
- **Responsive Design**: Works on desktop and mobile devices

## 🖌️ Polished UI & Animations

- **Framer Motion** for smooth, spring-based animations
- **Animated search bar** and button with loading spinner
- **Animated dashboard cards** with hover and tap effects
- **Slide-in profile and chart sections**
- **Animated 3D repo map popup**
- **Modern gradients, rounded corners, and shadows**
- **Responsive and mobile-friendly**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd github-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **(Recommended) Set up GitHub Personal Access Token for higher rate limits:**
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Generate a new token with `public_repo` scope
   - Create a `.env.local` file in the project root:
     ```env
     GITHUB_TOKEN=your_token_here
     ```
   - This increases your API rate limit from 60 to 5000 requests per hour
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 🧑‍💻 Usage
1. Enter a GitHub username in the input field
2. Click the **Search** button
3. View the interactive dashboard with profile statistics
4. Explore repositories in the 3D visualization

## 🛡️ API Rate Limiting
- **Without a token:** 60 requests/hour (shared across all users on your IP)
- **With a token:** 5000 requests/hour (per user)
- If you see a rate limit error, either wait 1 hour or add a GitHub token as described above

## 🗂️ Project Structure
```
├── components/
│   ├── Dashboard.js      # Main dashboard component (animated)
│   └── RepoMap3D.js     # 3D repository visualization (animated)
├── pages/
│   ├── api/
│   │   └── github.js     # GitHub API endpoint
│   ├── _app.js           # App wrapper
│   └── index.js          # Home page (animated)
├── styles/
│   └── globals.css       # Global styles
├── utils/
│   └── githubApi.js      # GitHub API utilities
└── package.json
```

## 🏆 UI/UX Highlights
- **Gradient backgrounds** and modern color palette
- **Animated cards** and popups for stats and repo details
- **Smooth transitions** for all interactive elements
- **Responsive layout** for all devices
- **Clear error and loading states**

## 🧩 Tech Stack
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **Charts:** Chart.js, React Chart.js 2
- **Animations:** Framer Motion
- **API:** GitHub REST API

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
MIT License - see LICENSE file for details

## 🙏 Acknowledgments
- GitHub API for providing user data
- Three.js community for 3D graphics
- Chart.js for data visualization
- Framer Motion for beautiful animations 