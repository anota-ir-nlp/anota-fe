import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Eye, EyeOff, User, Lock, UserCog } from "lucide-react";
import Frame1047 from "../imports/Frame1047";

interface LoginPageProps {
  onLogin: (user: { email: string; role: string; name: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on role
    const mockUser = {
      email,
      role,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
    };
    
    onLogin(mockUser);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        {/* Pen as background decoration */}
        <div className="absolute top-1/4 right-1/4 opacity-3 transform rotate-12 scale-150">
          <Frame1047 />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-pink-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-blue-400 rounded-full opacity-35 animate-pulse delay-500"></div>
        
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-pink-100/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Anota
            </span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600">
            Masuk ke sistem anotasi cerdas
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 backdrop-blur-md bg-white/80 border-white/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200/50 focus:bg-white/80 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/50 border-gray-200/50 focus:bg-white/80 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Role</Label>
              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="pl-10 bg-white/50 border-gray-200/50 focus:bg-white/80 transition-all duration-200">
                    <SelectValue placeholder="Pilih role Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="anotator">Anotator</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="kepala-riset">Kepala Riset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Lupa password?
              </button>
            </div>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
          <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Email: demo@anota.com</p>
            <p>Password: password</p>
            <p>Role: Pilih sesuai kebutuhan</p>
          </div>
        </div>
      </div>
    </div>
  );
}