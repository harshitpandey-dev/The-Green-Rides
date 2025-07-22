import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import RegistrationForm from "../../components/auth/RegistrationForm";

const Signup = () => {
  const [initialSignup, setInitialSignup] = useState(false);
  const [user, setUser] = useState(null);

  const handleCallbackResponse = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    setUser(decoded);
    setInitialSignup(true);
  };

  return (
    <div>
      {!initialSignup && (
        <div className="centered">
          <GoogleLogin
            onSuccess={handleCallbackResponse}
            onError={() => console.log("Login Failed")}
          />
        </div>
      )}

      {initialSignup && user && <RegistrationForm user={user} />}
    </div>
  );
};

export default Signup;
