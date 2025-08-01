import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Upload, 
  Target, 
  BarChart3, 
  Users, 
  Zap,
  BookOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Education
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Learning with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPal AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Experience intelligent homework assistance, automated grading, and personalized learning paths 
              powered by advanced AI technology. Upload assignments, get instant feedback, and track progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/auth/signin">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/demo">
                  Try Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to enhance learning and teaching with AI-powered tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Upload className="w-10 h-10 text-blue-600 mb-4" />
                <CardTitle>Smart File Upload & OCR</CardTitle>
                <CardDescription>
                  Upload PDFs, images, or handwritten assignments. Our OCR technology extracts text 
                  and mathematical expressions accurately.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="w-10 h-10 text-purple-600 mb-4" />
                <CardTitle>AI-Powered Solutions</CardTitle>
                <CardDescription>
                  Get step-by-step solutions with detailed explanations powered by GPT-4 and 
                  Kimi K2 models for mathematics, physics, and chemistry.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="w-10 h-10 text-green-600 mb-4" />
                <CardTitle>Automated Grading</CardTitle>
                <CardDescription>
                  Intelligent grading with customizable rubrics, instant feedback, and 
                  error detection with conceptual explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-orange-600 mb-4" />
                <CardTitle>Adaptive Quizzes</CardTitle>
                <CardDescription>
                  Personalized quiz generation based on weak areas, with immediate feedback 
                  and progress tracking for mastery learning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-indigo-600 mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive insights into student performance, learning patterns, 
                  and progress with beautiful visualizations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-10 h-10 text-pink-600 mb-4" />
                <CardTitle>Classroom Management</CardTitle>
                <CardDescription>
                  Efficient tools for teachers to manage assignments, track student progress, 
                  and generate detailed reports.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose EduPal AI?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-lg">Instant feedback and solutions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-lg">Support for multiple subjects</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-lg">Mobile-optimized experience</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-lg">Real-time progress tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-lg">Secure and privacy-focused</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
              <h4 className="text-2xl font-bold mb-4">Ready to get started?</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of students and teachers already using EduPal AI to enhance their learning experience.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/auth/signin">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">EduPal AI</h5>
              <p className="text-gray-400">
                Revolutionizing education with AI-powered learning tools.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Product</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Company</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduPal AI. All rights reserved. Made with ❤️ by Ahmad Rifki Aryanto</p>
          </div>
        </div>
      </footer>
    </div>
  )
}