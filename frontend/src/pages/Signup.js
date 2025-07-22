// import { useEffect, useState } from 'react';
// import jwt_decode from 'jwt-decode';
// import AddStudentForm from '../components/auth/AddStudentForm';

// const Signup = () => {
//   const [initialSignup, setInitialSignup] = useState(false);
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     /* global google */
//     google.accounts.id.initialize({
//       client_id:
//         '796516456467-obk13f0j5ajcme475pfl3ioecispqv5a.apps.googleusercontent.com',
//       callback: handleCallbackResponse,
//     });
//     google.accounts.id.renderButton(document.getElementById('signupDiv'), {
//       theme: 'outline',
//       size: 'large',
//     });
//   });
//   const handleCallbackResponse = (response) => {
//     var userObject = jwt_decode(response.credential);
//     document.getElementById('signupDiv').hidden = true;
//     // console.log(userObject);

//     if (userObject.email.includes('@hbtu.ac.in')) {
//       setUser(userObject);
//       // console.log(user);

//       setInitialSignup(true);
//     } else {
//       alert('Not a HBTU Id');
//       throw Error('Not a HBTU Id');
//     }
//   };

//   return (
//     <div>
//       {!initialSignup && (
//         <div className="centered">
//           <div id="signupDiv"></div>
//         </div>
//       )}
//       {initialSignup && (
//         <div>
//           <AddStudentForm user={user} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import AddStudentForm from "../components/auth/AddStudentForm";

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

      {initialSignup && user && (
        <div>
          <AddStudentForm user={user} />
        </div>
      )}
    </div>
  );
};

export default Signup;

// const Signup = () => {

//   useEffect(() => {
//     const initClient = () => {
//       gapi.client.init({
//         clientId: clientId,
//         scope: '',
//       });
//     };
//     gapi.load('client:auth2', initClient);
//   });
//   const onSuccess = (res) => {
//     console.log('success:', res);
//   };
//   const onFailure = (err) => {
//     console.log('failed:', err);
//   };

//   return (
//     <GoogleLogin
//       clientId={clientId}
//       buttonText="Sign in with Google"
//       onSuccess={onSuccess}
//       onFailure={onFailure}
//       cookiePolicy={'single_host_origin'}
//       isSignedIn={true}
//     />
//   );
// };

// export default Signup;
