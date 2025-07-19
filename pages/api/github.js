import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Missing username" });

  try {
    // Add headers to avoid rate limiting issues
    const headers = {
      'User-Agent': 'GitHub-Visualizer-App',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Add GitHub token if available (increases rate limit from 60 to 5000 requests/hour)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      console.log('GitHub token found and being used');
    } else {
      console.log('No GitHub token found, using unauthenticated requests');
    }

    // Fetch profile and repos in parallel
    const [profileRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers })
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const languages = repos.reduce((acc, repo) => {
      if (!repo.language) return acc;
      acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      profile,
      repos,
      stats: { totalStars, languages }
    });
  } catch (err) {
    console.error('GitHub API Error:', err.response?.status, err.response?.data || err.message);
    
    // Handle specific GitHub API errors
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (err.response?.status === 403) {
      const errorMessage = err.response?.data?.message || 'Rate limit exceeded';
      console.log('Rate limit error details:', errorMessage);
      
      // Check if it's a token-related error
      if (errorMessage.includes('Bad credentials') || errorMessage.includes('Invalid token')) {
        return res.status(401).json({ 
          error: "Invalid GitHub token. Please check your .env.local file.",
          details: "Make sure your GITHUB_TOKEN is correct and has the 'public_repo' scope."
        });
      }
      
      return res.status(429).json({ 
        error: "Rate limit exceeded. Please try again later.",
        details: errorMessage
      });
    }
    
    if (err.response?.status === 422) {
      return res.status(400).json({ error: "Invalid username" });
    }

    res.status(500).json({ 
      error: "Failed to fetch user data",
      details: err.response?.data?.message || err.message
    });
  }
}
