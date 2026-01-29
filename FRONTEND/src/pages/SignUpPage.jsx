import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex bg-base-100">
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 border-r border-base-content/10">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <MessageCircleIcon className="w-16 h-16 mx-auto text-white mb-6" />
            <h2 className="text-4xl font-bold text-base-content mb-4">Create Account</h2>
            <p className="text-base-content/60 text-lg">Sign up for a new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-2">
              <label className="auth-input-label text-base">Full Name</label>
              <div className="relative">
                <UserIcon className="auth-input-icon size-6" />

                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input h-14 pl-12 text-lg group-hover:bg-base-200 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

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


            <button className="btn btn-primary w-full h-14 text-lg font-bold rounded-lg text-white" type="submit" disabled={isSigningUp}>
              {isSigningUp ? (
                <LoaderIcon className="w-full h-6 animate-spin text-center" />
              ) : (
                "Create your Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60 text-lg">
              Already have an account?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-base-100 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <img
            src="image1.png"
            alt="People using mobile devices"
            className="w-full max-w-lg mx-auto h-auto object-contain opacity-80 grayscale-[20%] drop-shadow-2xl"
          />
          <div className="mt-12">
            <h3 className="text-4xl font-bold text-base-content mb-6">Join Our Community</h3>
            <p className="text-base-content/60 text-xl mb-8 max-w-lg mx-auto">Connect with friends, share moments, and stay in touch with your loved ones.</p>

            <div className="flex justify-center gap-4">
              <span className="auth-badge px-6 py-2 text-base">Free</span>
              <span className="auth-badge px-6 py-2 text-base">Private</span>
              <span className="auth-badge px-6 py-2 text-base">Global</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
