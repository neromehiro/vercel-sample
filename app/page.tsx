// app/page.tsx
"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

// モチベーショナルタスクのリスト
const defaultTasks = [
  "Read a book for 30 minutes",
  "Exercise for 15 minutes",
  "Write down 3 things you're grateful for",
  "Organize your workspace",
  "Learn something new online",
  "Reach out to a friend",
  "Meditate for 10 minutes",
  "Plan your next week"
];

export default function Home() {
  const [tasks, setTasks] = useState<string[]>(defaultTasks);
  const [newTask, setNewTask] = useState<string>("");

  // タスクを追加する関数
  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask(""); // 入力フィールドをクリア
    }
  };

  // タスクの削除
  const deleteTask = (taskToDelete: string) => {
    setTasks(tasks.filter(task => task !== taskToDelete));
  };

  // ランダムタスクジェネレーター
  const generateRandomTask = () => {
    const randomTask = defaultTasks[Math.floor(Math.random() * defaultTasks.length)];
    setTasks([...tasks, randomTask]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md bg-white">
        <CardHeader>
          <h2 className="text-xl font-bold text-center">Daily ToDo Generator</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Your Tasks:</h3>
            <ul>
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.li
                    key={task}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center">
                      <Checkbox className="mr-2" />
                      <span>{task}</span>
                    </div>
                    <Button
                      onClick={() => deleteTask(task)}
                      variant="ghost"
                      className="text-red-500"
                    >
                      Delete
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <div className="flex mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              className="mr-2"
            />
            <Button onClick={addTask} className="bg-green-500 hover:bg-green-700 text-white">
              Add
            </Button>
          </div>
          <Button onClick={generateRandomTask} className="bg-blue-500 hover:bg-blue-700 text-white w-full">
            Generate Random Task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
