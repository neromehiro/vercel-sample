// app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // ローディング用アイコン

// NewsAPIのエンドポイントとAPIキー
const API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = 'YOUR_NEWSAPI_KEY'; // 自身のNewsAPIキーに差し替え

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ニュースを取得する関数
  const fetchNews = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          country: 'us', // 国を指定（'jp' で日本のニュースなど）
          apiKey: API_KEY
        }
      });
      setNewsItems(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // 1分ごとにニュースを更新
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-900">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="https://png.pngtree.com/thumb_back/fh260/background/20211014/pngtree-news-tv-broadcast-technology-background-image_909022.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="blur-md opacity-30"
        />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 p-6 space-y-6">
        <h1 className="text-white text-4xl font-bold text-center">Latest News</h1>

        {/* ローディング中の表示 */}
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-white w-12 h-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((news, index) => (
              <a
                key={index}
                href={news.url} // ニュース記事へのリンク
                target="_blank" // 新しいタブで開く
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="bg-white/90 group-hover:shadow-lg transform transition duration-200 ease-in-out">
                  {news.urlToImage && (
                    <div className="h-48 overflow-hidden rounded-t-md">
                      <Image
                        src={news.urlToImage}
                        alt={news.title}
                        width={600}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                  )}
                  <CardHeader className="p-4">
                    <h2 className="text-lg font-semibold">{news.title}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(news.publishedAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-700 truncate">{news.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
