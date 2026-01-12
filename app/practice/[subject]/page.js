'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Filter, Search } from 'lucide-react';
import questionsData from '../../../data/questions.json';
import subjectsData from '../../../data/subjects.json';

export default function PracticePage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = params.subject;
  const grade = parseInt(searchParams.get('grade') || '12');

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  const subjectNames = {
    'mathematics': 'Mathematics',
    'physical-sciences': 'Physical Sciences',
    'life-sciences': 'Life Sciences'
  };

  useEffect(() => {
    loadTopics();
  }, [subjectId, grade]);

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions(selectedTopic);
    }
  }, [selectedTopic, yearFilter]);

  const loadTopics = () => {
    const subject = subjectsData[subjectId];
    if (subject) {
      setTopics(subject.topics);
    }
  };

  const loadQuestions = (topic) => {
    const subjectName = subjectNames[subjectId];
    const gradeData = questionsData[subjectName]?.[grade.toString()] || {};
    const topicQuestions = gradeData[topic] || [];
    
    let filtered = topicQuestions;
    
    // Apply year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(q => q.year === parseInt(yearFilter));
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setQuestions(filtered);
  };

  const getQuestionCount = (topic) => {
    const subjectName = subjectNames[subjectId];
    const gradeData = questionsData[subjectName]?.[grade.toString()] || {};
    return (gradeData[topic] || []).length;
  };

  const getAvailableYears = () => {
    if (!selectedTopic) return [];
    const subjectName = subjectNames[subjectId];
    const gradeData = questionsData[subjectName]?.[grade.toString()] || {};
    const topicQuestions = gradeData[selectedTopic] || [];
    const years = [...new Set(topicQuestions.map(q => q.year))];
    return years.sort((a, b) => b - a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {subjectNames[subjectId]}
              </h1>
              <p className="text-gray-600 mt-1">Grade {grade} - CAPS Curriculum</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {topics.reduce((sum, topic) => sum + getQuestionCount(topic), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTopic ? (
          /* Topic Selection */
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select a Topic to Practice
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => {
                const count = getQuestionCount(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {topic}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {count} question{count !== 1 ? 's' : ''} available
                        </p>
                      </div>
                      <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((count / 20) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Questions Display */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSearchTerm('');
                    setYearFilter('all');
                  }}
                  className="mr-4 text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTopic}
                  </h2>
                  <p className="text-gray-600">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <option value="all">All Years</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    loadQuestions(selectedTopic);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No questions found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Question {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {question.year} - {question.source}
                        </span>
                        {question.marks && (
                          <span className="text-sm font-medium text-green-600">
                            [{question.marks} marks]
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <div className="text-gray-800 leading-relaxed space-y-2">
                        {question.questionText.split('\n').map((line, i) => {
                          // Skip empty lines and page numbers
                          const trimmedLine = line.trim();
                          if (!trimmedLine || 
                              trimmedLine.match(/^Page \d+/i) ||
                              trimmedLine.match(/^Mathematics\/P1/i) ||
                              trimmedLine.match(/^NSC/i) ||
                              trimmedLine.match(/^Copyright/i) ||
                              trimmedLine.match(/^DBE\//i) ||
                              trimmedLine.match(/^\[.*marks?\]$/i) ||
                              trimmedLine.length < 3) {
                            return null;
                          }
                          
                          // Check if line looks like a sub-question number
                          const isSubQuestion = trimmedLine.match(/^\d+\.\d+(\.\d+)?/);
                          
                          return (
                            <p 
                              key={i} 
                              className={`${isSubQuestion ? 'font-semibold text-blue-700 mt-3' : ''}`}
                            >
                              {trimmedLine}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {question.topics.map(topic => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
