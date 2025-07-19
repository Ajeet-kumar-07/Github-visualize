import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';

function RepoNode({ repo, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const size = Math.max(0.5, Math.min(2, repo.stargazers_count / 10 + 0.5));
  const color = hovered ? '#3B82F6' : '#10B981';

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} />
      </Sphere>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {repo.name}
      </Text>
    </group>
  );
}

function RepoMap({ repos, onRepoClick }) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && !isHovered) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const positions = repos.map((_, index) => {
    const angle = (index / repos.length) * Math.PI * 2;
    const radius = 8;
    const height = Math.sin(angle * 3) * 2;
    
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
  });

  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {repos.map((repo, index) => (
        <RepoNode
          key={repo.id}
          repo={repo}
          position={positions[index]}
          onClick={() => onRepoClick(repo)}
        />
      ))}
    </group>
  );
}

export default function RepoMap3D({ repos }) {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!repos || repos.length === 0 || !mounted) return null;

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4">3D Repository Map</h2>
      <div className="h-96 relative">
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RepoMap repos={repos} onRepoClick={handleRepoClick} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
        
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute top-4 right-4 bg-white p-6 rounded-xl shadow-xl max-w-xs border border-gray-200"
          >
            <h3 className="font-bold text-lg mb-2">{selectedRepo.name}</h3>
            {selectedRepo.description && (
              <p className="text-gray-600 text-sm mb-2">{selectedRepo.description}</p>
            )}
            <div className="flex space-x-4 text-sm">
              <span>⭐ {selectedRepo.stargazers_count}</span>
              <span>🔀 {selectedRepo.forks_count}</span>
              {selectedRepo.language && (
                <span className="text-blue-600">{selectedRepo.language}</span>
              )}
            </div>
            <motion.button
              onClick={() => setSelectedRepo(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-medium mb-2">💡 How to interact:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <p>🖱️ <strong>Click</strong> on any sphere to view repository details</p>
          <p>🔄 <strong>Drag</strong> to rotate the 3D view</p>
          <p>⏸️ <strong>Hover</strong> to pause rotation</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
