// app/page.tsx
"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const profileData = {
  name: "山田 太郎",
  profession: "フロントエンド エンジニア",
  bio: "プログラミングの魅力を伝えるクリエイター。初心者向けのチュートリアルを提供し、日々技術を追求。",
  skills: ["JavaScript", "React", "Next.js", "Tailwind CSS", "TypeScript"],
  projects: [
    { title: "ポートフォリオサイト", description: "個人のポートフォリオを動的に作成" },
    { title: "Todo アプリ", description: "React Hooks を使ったシンプルな Todo アプリ" },
    { title: "ブログ", description: "Next.js で構築されたブログプラットフォーム" },
  ]
};

export default function HomePage() {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <motion.h1
              className="text-3xl font-bold text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {profileData.name}
            </motion.h1>
            <motion.h2
              className="text-xl text-center text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {profileData.profession}
            </motion.h2>
          </CardHeader>
          <CardContent>
            <motion.p
              className="text-center text-gray-700 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {profileData.bio}
            </motion.p>
            <div className="flex justify-center mb-4">
              <Button onClick={handleToggleDetails} className="bg-blue-500 text-white">
                {showDetails ? "詳細を非表示" : "詳細を表示"}
              </Button>
            </div>
            {showDetails && (
              <motion.div
                className="mt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-bold mb-2">スキル:</h3>
                <ul className="list-disc list-inside">
                  {profileData.skills.map((skill, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
                <h3 className="text-lg font-bold mt-4 mb-2">プロジェクト:</h3>
                <ul className="list-disc list-inside">
                  {profileData.projects.map((project, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <strong>{project.title}:</strong> {project.description}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
