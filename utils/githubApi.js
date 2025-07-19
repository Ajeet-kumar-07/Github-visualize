import axios from "axios";

const BASE_URL = "https://api.github.com";

/**
 * Fetch GitHub profile + repositories for a given username.
 * @param {string} username - GitHub username
 * @returns {Promise<{profile: Object, repos: Array, stats: Object}>}
 */
export async function fetchUserData(username) {
  try {
    const [profileRes, reposRes] = await Promise.all([
      axios.get(`${BASE_URL}/users/${username}`),
      axios.get(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`)
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    // Aggregate stats
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    const languages = repos.reduce((acc, repo) => {
      if (!repo.language) return acc;
      acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});

    return {
      profile,
      repos,
      stats: {
        totalStars,
        languages
      }
    };
  } catch (error) {
    console.error("GitHub API fetch failed:", error.message);
    return { profile: null, repos: [], stats: { totalStars: 0, languages: {} } };
  }
}

/**
 * Utility to fetch just repos for a username.
 * @param {string} username
 * @returns {Promise<Array>} Repositories array
 */
export async function fetchRepos(username) {
  try {
    const reposRes = await axios.get(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`);
    return reposRes.data;
  } catch (error) {
    console.error("Failed to fetch repos:", error.message);
    return [];
  }
}
