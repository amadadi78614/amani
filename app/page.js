'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp, FlaskConical, Brain, GraduationCap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState(12);

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-700',
      topics: 7
    },
    {
      id: 'physical-sciences',
      name: 'Physical Sciences',
      icon: FlaskConical,
      color: 'from-purple-500 to-purple-700',
      topics: 4
    },
    {
      id: 'life-sciences',
      name: 'Life Sciences',
      icon: Brain,
      color: 'from-green-500 to-green-700',
      topics: 5
    }
  ];

  const handleSubjectClick = (subjectId) => {
    router.push(`/practice/${subjectId}?grade=${selectedGrade}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <GraduationCap className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">
              DBE Exam Bank
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Practice exam questions by topic from past DBE papers
            </p>
            <div className="flex justify-center items-center space-x-4">
              <span className="text-lg">Select your grade:</span>
              <div className="flex space-x-2">
                {[11, 12].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedGrade === grade
                        ? 'bg-white text-blue-700 shadow-lg scale-105'
                        : 'bg-blue-500 hover:bg-blue-400 text-white'
                    }`}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Choose Your Subject
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-8 text-white">
                  <Icon className="w-16 h-16 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-blue-100">{subject.topics} Topics Available</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm">Grade {selectedGrade}</span>
                    <span className="text-sm bg-white text-blue-700 px-3 py-1 rounded-full font-semibold">
                      Start →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Topic-Based Practice</h3>
            <p className="text-gray-600">
              Focus on specific topics like Algebra, Calculus, or Mechanics
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Years of Past Papers</h3>
            <p className="text-gray-600">
              Questions from 2018-2024 exam papers with memos
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CAPS Aligned</h3>
            <p className="text-gray-600">
              All content aligned with current CAPS curriculum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
