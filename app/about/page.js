import Link from 'next/link';
import { BookOpen, Download, Search, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About DBE Exam Bank</h1>
        
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is DBE Exam Bank?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            DBE Exam Bank is a free educational resource that helps South African students practice 
            for their final exams by organizing past Department of Basic Education (DBE) exam papers 
            by specific topics.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Instead of going through entire exam papers, students can now focus on specific topics 
            they need to improve, making study time more efficient and targeted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Topic-Based Learning</h3>
            <p className="text-gray-700">
              Practice specific topics like Algebra, Mechanics, or Cell Biology without going 
              through entire papers.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Search className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
            <p className="text-gray-700">
              Filter questions by year, search for keywords, and find exactly what you need 
              to practice.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Download className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Official Papers</h3>
            <p className="text-gray-700">
              All questions are sourced from official DBE exam papers and trusted educational 
              websites.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">CAPS Aligned</h3>
            <p className="text-gray-700">
              All content follows the current CAPS curriculum for Grade 11 and Grade 12 students.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">Supported Subjects</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Mathematics (Grade 11 & 12)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Physical Sciences (Grade 11 & 12)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Life Sciences (Grade 11 & 12)
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                1
              </span>
              <div>
                <strong>Select your grade</strong> - Choose between Grade 11 or Grade 12
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                2
              </span>
              <div>
                <strong>Choose a subject</strong> - Pick from Mathematics, Physical Sciences, or Life Sciences
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                3
              </span>
              <div>
                <strong>Select a topic</strong> - Focus on the specific area you want to practice
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                4
              </span>
              <div>
                <strong>Practice!</strong> - Work through questions from past papers on that topic
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Practicing Now
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>© 2024 DBE Exam Bank. Educational purposes only.</p>
          <p className="mt-2">
            All exam papers are sourced from the Department of Basic Education and 
            other trusted educational resources.
          </p>
        </div>
      </div>
    </div>
  );
}
