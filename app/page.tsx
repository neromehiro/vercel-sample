// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TodoApp() {
  // 変数として文字列を扱う
  const appTitle = "My Todo List App";
  const addItemText = "Add Todo";
  const inputPlaceholder = "Enter a new todo...";
  const noTodoMessage = "No todos available";
  const completeText = "Complete";
  const removeText = "Remove";

  // ステートの管理
  const [todos, setTodos] = useState<{ text: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // 初期化時にlocalStorageからデータを読み込む
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // todosが変更されるたびにlocalStorageに保存
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      localStorage.removeItem("todos"); // 空の場合は削除
    }
  }, [todos]);

  // 新しいTodoを追加する関数
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  // Todoの完了ステータスを切り替える関数
  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  // Todoを削除する関数
  const removeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-md bg-white">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">{appTitle}</h1>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder={inputPlaceholder}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addTodo}>{addItemText}</Button>
          </div>
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">{noTodoMessage}</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between p-2 border rounded-lg ${
                    todo.completed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="space-x-2">
                    <Button onClick={() => toggleComplete(index)}>
                      {completeText}
                    </Button>
                    <Button onClick={() => removeTodo(index)} variant="destructive">
                      {removeText}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
