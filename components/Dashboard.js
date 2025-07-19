import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard({ profile, stats }) {
  const [chartData, setChartData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (stats?.languages && mounted) {
      const languageData = Object.entries(stats.languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

      setChartData({
        labels: languageData.map(([lang]) => lang),
        datasets: [
          {
            label: 'Repositories',
            data: languageData.map(([, count]) => count),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ],
            borderWidth: 2,
          },
        ],
      });
    }
  }, [stats, mounted]);

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Public Repos</h3>
          <p className="text-3xl font-bold">{profile.public_repos}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Followers</h3>
          <p className="text-3xl font-bold">{profile.followers}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Following</h3>
          <p className="text-3xl font-bold">{profile.following}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold">Total Stars</h3>
          <p className="text-3xl font-bold">{stats?.totalStars || 0}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-50 p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold">{profile.name || profile.login}</h2>
                <p className="text-gray-600">@{profile.login}</p>
              </div>
            </div>
            {profile.bio && (
              <p className="text-gray-700">{profile.bio}</p>
            )}
            {profile.location && (
              <p className="text-gray-600">📍 {profile.location}</p>
            )}
            {profile.blog && (
              <a
                href={profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                🌐 {profile.blog}
              </a>
            )}
            <p className="text-gray-600">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {chartData && mounted && (
          <motion.div 
            className="bg-gray-50 p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">Top Languages</h3>
            <div className="h-64">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
                          </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
}
