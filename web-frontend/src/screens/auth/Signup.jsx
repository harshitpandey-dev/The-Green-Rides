import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "../../contexts/authContext";
import { registerUser } from "../../services/auth.service";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaIdCard,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../../assets/gogreen.png";
import "../../styles/screens/auth.css";

const ModernSignup = () => {
  const history = useHistory();
  const authCtx = useUser();
  
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const rollNoInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const onChange = (value) => {
    setIsVerified(true);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    const enteredName = nameInputRef.current.value.trim();
    const enteredEmail = emailInputRef.current.value.trim();
    const enteredRollNo = rollNoInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    if (!enteredName || !enteredEmail || !enteredRollNo || !enteredPassword || !enteredConfirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (enteredPassword !== enteredConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (enteredPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        name: enteredName,
        email: enteredEmail,
        rollNo: enteredRollNo,
        password: enteredPassword,
        role: "student" // Default role
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Account created successfully! Redirecting to login...");
        
        setTimeout(() => {
          history.replace("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
              Join the green revolution on your campus. 
              Register now to start using sustainable transportation.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join Green Rides and go green today</p>
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
              <label htmlFor="name" className="form-label">
                <FaUser style={{ marginRight: '8px' }} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                ref={nameInputRef}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

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
              <label htmlFor="rollNo" className="form-label">
                <FaIdCard style={{ marginRight: '8px' }} />
                Roll Number
              </label>
              <input
                type="text"
                id="rollNo"
                ref={rollNoInputRef}
                className="form-input"
                placeholder="Enter your roll number"
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
                  placeholder="Create a password (min 6 characters)"
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FaLock style={{ marginRight: '8px' }} />
                Confirm Password
              </label>
              <div className="password-input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  ref={confirmPasswordInputRef}
                  className="form-input"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleShowConfirmPassword}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSignup;
