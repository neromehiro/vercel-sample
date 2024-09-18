"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialVariables = {
  a: 0,
  b: 0,
  c: 0,
  x: 0,
  y: 0,
};

type Operation = '+' | '-' | '*' | '/' | '^' | 'sqrt' | 'sin' | 'cos' | 'tan' | 'log';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('');
  const [variables, setVariables] = useState(initialVariables);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('calculatorHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleVariableChange = (variable: keyof typeof initialVariables, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: parseFloat(value) || 0 }));
  };

  const appendToDisplay = (value: string) => {
    setDisplay(prev => prev + value);
  };

  const clearDisplay = () => {
    setDisplay('');
    setError(null);
    setSuccess(null);
  };

  const calculateResult = () => {
    try {
      const result = evaluateExpression(display);
      setDisplay(result.toString());
      setHistory(prev => [...prev, `${display} = ${result}`]);
      setSuccess('計算が成功しました！');
      setError(null);
    } catch (err) {
      setError('計算エラー: ' + (err as Error).message);
      setSuccess(null);
    }
  };

  const evaluateExpression = (expr: string): number => {
    const tokens = tokenize(expr);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
  };

  const tokenize = (expr: string): (string | number)[] => {
    const regex = /([a-z]+|\d+|\S)/g;
    return expr.match(regex)?.map(token => {
      if (token in variables) {
        return variables[token as keyof typeof variables];
      }
      return isNaN(Number(token)) ? token : Number(token);
    }) || [];
  };

  const precedence = (op: string): number => {
    switch (op) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      case '^':
        return 3;
      default:
        return 0;
    }
  };

  const infixToPostfix = (tokens: (string | number)[]): (string | number)[] => {
    const output: (string | number)[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      if (typeof token === 'number') {
        output.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!);
        }
        operators.pop(); // Remove '('
      } else {
        while (
          operators.length &&
          precedence(operators[operators.length - 1]) >= precedence(token as string)
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token as string);
      }
    }

    while (operators.length) {
      output.push(operators.pop()!);
    }

    return output;
  };

  const evaluatePostfix = (postfix: (string | number)[]): number => {
    const stack: number[] = [];

    for (const token of postfix) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop()!;
        const a = token === 'sqrt' || token === 'sin' || token === 'cos' || token === 'tan' || token === 'log' ? 0 : stack.pop()!;
        stack.push(applyOperation(token as Operation, a, b));
      }
    }

    return stack[0];
  };

  const applyOperation = (op: Operation, a: number, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) throw new Error('0で割ることはできません');
        return a / b;
      case '^': return Math.pow(a, b);
      case 'sqrt': return Math.sqrt(b);
      case 'sin': return Math.sin(b);
      case 'cos': return Math.cos(b);
      case 'tan': return Math.tan(b);
      case 'log': return Math.log(b);
      default: throw new Error('不明な演算子');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">関数電卓</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            value={display}
            readOnly
            className="text-right text-lg font-mono p-2 w-full"
          />
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(variables).map((variable) => (
              <Input
                key={variable}
                type="number"
                placeholder={variable}
                value={variables[variable as keyof typeof variables]}
                onChange={(e) => handleVariableChange(variable as keyof typeof variables, e.target.value)}
                className="text-center"
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/'].map((btn) => (
              <Button key={btn} onClick={() => appendToDisplay(btn)}>{btn}</Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['4', '5', '6', '*'].map((btn) => (
              <Button key={btn} onClick={() => appendToDisplay(btn)}>{btn}</Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '-'].map((btn) => (
              <Button key={btn} onClick={() => appendToDisplay(btn)}>{btn}</Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['0', '.', '=', '+'].map((btn) => (
              <Button
                key={btn}
                onClick={() => btn === '=' ? calculateResult() : appendToDisplay(btn)}
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['(', ')', '^', 'sqrt'].map((btn) => (
              <Button key={btn} onClick={() => appendToDisplay(btn)}>{btn}</Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['sin', 'cos', 'tan', 'log'].map((btn) => (
              <Button key={btn} onClick={() => appendToDisplay(btn)}>{btn}</Button>
            ))}
          </div>
          <Button onClick={clearDisplay} className="w-full">クリア</Button>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant="default" className="mt-4 bg-green-100">
              <Check className="h-4 w-4" />
              <AlertTitle>成功</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">計算履歴</h3>
          <ul className="space-y-1">
            {history.slice(-5).map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-sm text-gray-600"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;