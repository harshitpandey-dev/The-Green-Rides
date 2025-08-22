import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "../../contexts/authContext";
import { loginUser } from "../../services/auth.service";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../../assets/gogreen.png";
import "../../styles/screens/auth.css";

const ModernLogin = () => {
  const history = useHistory();
  const authCtx = useUser();
  
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const onChange = (value) => {
    setIsVerified(true);
    setError(""); // Clear any existing errors
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    const enteredEmail = emailInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value;

    if (!enteredEmail || !enteredPassword) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: enteredEmail,
        password: enteredPassword,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Login successful! Redirecting...");
        
        // Set user context
        authCtx.login(data.user, data.token);
        
        // Redirect based on user role
        setTimeout(() => {
          if (data.user.role === "super_admin") {
            history.replace("/admin");
          } else if (data.user.role === "finance_admin") {
            history.replace("/finance-admin");
          } else {
            history.replace("/dashboard");
          }
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side - Brand */}
        <div className="auth-brand">
          <div className="auth-brand-content">
            <img src={logo} alt="Green Rides" className="brand-logo" />
            <h1 className="brand-title">Green Rides</h1>
            <p className="brand-subtitle">
              Sustainable campus transportation solution. 
              Join us in making your campus greener, one ride at a time.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="error-message">
              <FaExclamationCircle />
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <FaCheckCircle />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope style={{ marginRight: '8px' }} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                ref={emailInputRef}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock style={{ marginRight: '8px' }} />
                Password
              </label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  ref={passwordInputRef}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="recaptcha-container">
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={onChange}
                theme="light"
              />
            </div>

            <button
              type="submit"
              className={`auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !isVerified}
            >
              {isLoading && <div className="loading-spinner"></div>}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
