import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, LockIcon, MailIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen w-full flex bg-base-100">
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 border-r border-base-content/10">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <MessageCircleIcon className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-4xl font-bold text-base-content mb-4">Welcome Back</h2>
            <p className="text-base-content/60 text-lg">Login to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="auth-input-label text-base">Email</label>
              <div className="relative">
                <MailIcon className="auth-input-icon size-6" />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input h-14 pl-12 text-lg group-hover:bg-base-200 transition-colors"
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="auth-input-label text-base">Password</label>
              <div className="relative">
                <LockIcon className="auth-input-icon size-6" />

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input h-14 pl-12 text-lg group-hover:bg-base-200 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full h-14 text-lg font-bold rounded-lg" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <LoaderIcon className="w-full h-6 animate-spin text-center" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60 text-lg">
              New to Linkverse?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-base-100 relative overflow-hidden">

        <div className="relative z-10 text-center">
          <img
            src="image2.png"
            alt="People using mobile devices"
            className="w-full max-w-lg mx-auto h-auto object-contain opacity-80 grayscale-[20%] drop-shadow-2xl"
          />
          <div className="mt-12">
            <h3 className="text-4xl font-bold text-base-content mb-6">Connect Anytime, Anywhere</h3>
            <p className="text-base-content/60 text-xl mb-8 max-w-lg mx-auto">Join our community and experience seamless communication with friends and family.</p>

            <div className="flex justify-center gap-4">
              <span className="auth-badge px-6 py-2 text-base">Real-time Chat</span>
              <span className="auth-badge px-6 py-2 text-base">Secure</span>
              <span className="auth-badge px-6 py-2 text-base">Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;

