// app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 背景画像のURL
const backgroundImage = 'https://png.pngtree.com/thumb_back/fh260/background/20211014/pngtree-news-tv-broadcast-technology-background-image_909022.png';

// ニュースの見出しと本文を最初に設定する
const initialNews = [
  { id: 1, title: 'Breaking News: Market Hits All-Time High', content: 'The stock market reaches an all-time high amid positive earnings reports.' },
  { id: 2, title: 'Technology: AI Revolutionizing Healthcare', content: 'Artificial intelligence is rapidly transforming healthcare by providing accurate diagnostics and personalized treatments.' },
  { id: 3, title: 'Environment: Global Climate Change Initiatives', content: 'Governments around the world are accelerating efforts to combat climate change.' }
];

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState(initialNews);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // ニュースを自動更新する関数（簡単なシミュレーション）
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = newsItems.length + 1;
      const newNewsItem = {
        id: newId,
        title: `New Update ${newId}: Breaking News`,
        content: `This is a simulated breaking news update #${newId}.`
      };
      setNewsItems(prevNews => [newNewsItem, ...prevNews]);
    }, 5000); // 5秒ごとに新しいニュースを追加

    return () => clearInterval(interval); // コンポーネントがアンマウントされたらタイマーをクリア
  }, [newsItems]);

  // 新しいニュースを追加するためのハンドラ
  const addNewsItem = () => {
    if (newTitle && newContent) {
      const newId = newsItems.length + 1;
      const newNewsItem = {
        id: newId,
        title: newTitle,
        content: newContent
      };
      setNewsItems([newNewsItem, ...newsItems]);
      setNewTitle('');
      setNewContent('');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-800">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="blur-md"
        />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 p-6 space-y-6">
        <h1 className="text-white text-4xl font-bold text-center">Latest News</h1>
        
        {/* ニュース入力フォーム */}
        <div className="flex space-x-4 justify-center">
          <Input 
            className="w-1/4"
            placeholder="Enter news title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)} 
          />
          <Input 
            className="w-1/2"
            placeholder="Enter news content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)} 
          />
          <Button onClick={addNewsItem}>Add News</Button>
        </div>

        {/* ニュース一覧 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map(news => (
            <Card key={news.id} className="bg-white/90">
              <CardHeader>
                <h2 className="text-lg font-semibold">{news.title}</h2>
              </CardHeader>
              <CardContent>
                <p>{news.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
