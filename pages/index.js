import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import RepoMap3D from "../components/RepoMap3D";


export default function Home() {
  const [searchUsername, setSearchUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/github?username=${searchUsername.trim()}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      
      setProfile(data.profile);
      setRepos(data.repos);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
      setProfile(null);
      setRepos([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">GitHub Visualizer</h1>
          <p className="text-gray-500">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            GitHub Visualizer
          </h1>
          <p className="text-gray-600 text-lg">Explore GitHub profiles with interactive 3D visualizations</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex gap-3 max-w-md mx-auto">
            <motion.input
              type="text"
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter GitHub username"
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.button
              type="submit"
              disabled={loading || !searchUsername.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                'Search'
              )}
            </motion.button>
          </div>
          <motion.p 
            className="text-sm text-gray-500 mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            💡 Note: GitHub API has rate limits (60 requests/hour without token). 
            <br />
            🔑 <strong>To avoid rate limits:</strong> Add a GitHub token or wait 1 hour for reset.
          </motion.p>
        </motion.form>
        {loading ? (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading GitHub data...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl shadow-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 font-medium text-lg mb-3">Error: {error}</p>
            <p className="text-red-500 text-sm">
              {error.includes('Rate limit') ? (
                <>
                  GitHub API rate limit exceeded (60 requests/hour limit).
                  <br />
                  <strong>Solutions:</strong>
                  <br />
                  1️⃣ <strong>Wait 1 hour</strong> for the rate limit to reset
                  <br />
                  2️⃣ <strong>Add a GitHub token</strong> for 5000 requests/hour:
                  <br />
                  • Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener" className="underline">GitHub Settings Tokens</a>
                  <br />
                  • Create token with <code>public_repo</code> scope
                  <br />
                  • Add to <code>.env.local</code>: <code>GITHUB_TOKEN=your_token</code>
                </>
              ) : error.includes('Invalid GitHub token') ? (
                <>
                  <strong>Token Error:</strong> Your GitHub token is invalid or missing.
                  <br />
                  <strong>Fix:</strong>
                  <br />
                  1️⃣ Check your <code>.env.local</code> file exists
                  <br />
                  2️⃣ Make sure the token format is: <code>GITHUB_TOKEN=ghp_your_token_here</code>
                  <br />
                  3️⃣ Verify the token has <code>public_repo</code> scope
                  <br />
                  4️⃣ Restart the development server
                </>
              ) : (
                'Please check the username and try again.'
              )}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {profile && <Dashboard profile={profile} stats={stats} />}
            {repos && repos.length > 0 && <RepoMap3D repos={repos} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
