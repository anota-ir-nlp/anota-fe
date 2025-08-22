import { useState } from "react";
import Frame1047 from "./imports/Frame1047";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { CheckCircle, Zap, Target, Users, ArrowRight, Sparkles, Brain, Database } from "lucide-react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

interface User {
  email: string;
  role: string;
  name: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "dashboard">("landing");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("landing");
  };

  const handleStartAnnotating = () => {
    setCurrentView("login");
  };

  if (currentView === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentView === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          {/* Pen as background decoration */}
          <div className="absolute top-1/4 right-1/4 opacity-5 transform rotate-12 scale-150">
            <Frame1047 />
          </div>
          
          {/* Elegant gradient line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-pulse delay-500"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-9xl mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Anota
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-pink-500 mx-auto rounded-full mb-8"></div>
            <p className="text-2xl text-gray-600 mb-4 tracking-wide">
              Anotasi Cerdas. Dataset Sempurna.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Transform your grammatical error correction research with intelligent annotation tools designed for precision and speed.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleStartAnnotating}
            >
              Start Annotating
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg shadow-sm hover:shadow-md transition-all duration-300">
              Learn More
            </Button>
          </div>
          
          {/* Subtle features preview */}
          <div className="mt-16 flex justify-center gap-12 text-center opacity-60">
            <div className="flex flex-col items-center">
              <Brain className="w-6 h-6 text-green-500 mb-2" />
              <span className="text-sm text-gray-600">AI-Powered</span>
            </div>
            <div className="flex flex-col items-center">
              <Target className="w-6 h-6 text-pink-500 mb-2" />
              <span className="text-sm text-gray-600">Precision Tools</span>
            </div>
            <div className="flex flex-col items-center">
              <Database className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-sm text-gray-600">Export Ready</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">
              Why Choose Anota?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to make dataset annotation 
              faster, more accurate, and enjoyable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-gray-200/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Smart AI Assistance</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI pre-annotates your text, suggesting grammatical error corrections 
                and highlighting potential issues to speed up your workflow.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-gray-200/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Precision Annotation</h3>
              <p className="text-gray-600 leading-relaxed">
                Fine-tune error categories, correction types, and annotation labels with 
                pixel-perfect precision for research-grade datasets.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-gray-200/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Export Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Export your annotated datasets in multiple formats including JSON, CSV, 
                and XML - ready for your ML models and research.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl text-gray-600">
              Get started with our intuitive three-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white">1</span>
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Upload Your Text</h3>
              <p className="text-gray-600 leading-relaxed">
                Import your raw text data in various formats. Our platform supports 
                multiple file types and bulk uploads for large datasets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white">2</span>
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Smart Annotation</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our intelligent annotation tools to mark grammatical errors, 
                corrections, and categories. AI assistance speeds up the process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white">3</span>
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">Export & Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Download your perfectly annotated dataset ready for training 
                GEC models or conducting linguistic research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl mb-6 text-gray-900">
                Built for Researchers, 
                <span className="block text-green-600">Loved by Linguists</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of researchers and developers who trust Anota 
                for their grammatical error correction projects.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg text-gray-900 mb-1">10x Faster Annotation</h4>
                    <p className="text-gray-600">AI-powered suggestions reduce manual work by 90%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg text-gray-900 mb-1">Research-Grade Accuracy</h4>
                    <p className="text-gray-600">Validated annotation schemas ensure consistent quality</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg text-gray-900 mb-1">Collaborative Features</h4>
                    <p className="text-gray-600">Work with your team in real-time with built-in review tools</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-pink-100 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-2xl text-green-600 mb-1">10x</div>
                    <div className="text-sm text-gray-600">Faster Processing</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-2xl text-pink-600 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl text-blue-600 mb-1">1000+</div>
                    <div className="text-sm text-gray-600">Happy Users</div>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-2xl text-purple-600 mb-1">50M+</div>
                    <div className="text-sm text-gray-600">Annotations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-green-500 to-pink-500 rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl mb-6">
            Ready to Transform Your 
            <span className="block bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">
              Dataset Annotation?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the revolution in grammatical error correction research. 
            Start creating perfect datasets today.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
              <Zap className="mr-2 w-5 h-5" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Users className="mr-2 w-5 h-5" />
              Contact Sales
            </Button>
          </div>
          
          <p className="text-gray-400 mt-6">
            No credit card required • Free trial available • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <div className="text-2xl text-gray-800 mb-2">Anota</div>
            <p className="text-gray-600">Anotasi Cerdas. Dataset Sempurna.</p>
          </div>
          
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Documentation</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
          </div>
          
          <p className="text-gray-400 mt-6">
            © 2025 Anota. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}