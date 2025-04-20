import Header from "../components/header";
import Footer from "../components/footer";
import {SignUp, useSignUp} from "@clerk/clerk-react";
import {useState, useEffect} from "react";
import { useNavigate, redirect } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/register";

export async function loader(context: Route.LoaderArgs) {
    const {userId} = await getAuth(context);
    if (userId) {
      return redirect('/');
    }
    return userId;
  }

export default function Register({loaderData}: Route.ComponentProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [errors, setErrors] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '', policy: '' });

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
    } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
}, [confirmPassword, password]);

// Input Validation Function
const validateInputs = () => {
    let valid = true;
    const newErrors = { firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '', policy: '' };

    if (!firstName.trim()) {
        newErrors.firstName = 'First name is required';
        valid = false;
    }
    if (!lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        valid = false;
    }
    if (!username.trim()) {
        newErrors.username = 'Username is required';
        valid = false;
    }
    if (!emailAddress.trim() || !/\S+@\S+\.\S+/.test(emailAddress)) {
        newErrors.email = 'Invalid email format';
        valid = false;
    }
    if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        valid = false;
    }
    if (!policyAccepted) {
        newErrors.policy = 'You must accept the privacy policy';
        valid = false;
    }

    setErrors(newErrors);
    return valid;
};

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!validateInputs()) return;
    
    try {
      const response = await signUp.create({
          username,
          firstName,
          lastName,
          emailAddress,
          password,
          //publicMetadata: {
          //    role: role
          //}
      })
      console.log(JSON.stringify(response, null, 2))

      if(response.status == 'complete') {
          //const backend_response = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/users/create_user`, {
          const baseURL = process.env.VITE_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const backend_response = await fetch(`${baseURL}/users/create_user`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  id : response.createdUserId,
                  username: response.username,
                  firstName: response.firstName,
                  lastName: response.lastName,
                  email: response.emailAddress,
              }),
          })
          const data = await backend_response.json();
          console.log("Successfully created new User with ID : ", JSON.stringify(data));
          console.log("Signed up successfully")
          alert("Signed up successfully!")
          navigate('/');
      }
  } catch (err) {
      console.error(JSON.stringify(err, null, 2))
  }
  console.log("Sign up handling complete")
}

    return (
        <main className="flex items-center justify-center size-full min-h-screen">
      <div className="flex flex-col items-center space-y-4 size-full">
        <Header/>
        <div className="flex items-center justify-center size-full">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>
        
        
            <div className="mb-4">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">First Name</label>
                <input type="text" id="firstname" name="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            <div className="mb-4">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">Last Name</label>
                <input type="text" id="lastname" name="lastname"  value={lastName} onChange={(e) => setLastName(e.target.value)}required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                <input type="email" id="email" name="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Confirm Password</label>
                <input type="password" id="confirmpassword" name="confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            
            <div className="mb-4 flex items-center">
                <input type="checkbox" id="terms" name="terms" required className="mr-2" checked={policyAccepted} onChange={() => setPolicyAccepted(!policyAccepted)}/>
                <label htmlFor="terms" className="text-sm text-gray-600" >I agree to the <a href="#" className="text-blue-500">terms & conditions</a></label>
            </div>
            {errors.policy && <p className="text-red-500 text-xs mt-1">{errors.policy}</p>}
            
            <button type="submit" onClick={onSignUpPress}
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
                Sign Up
            </button>
        

        
        <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-blue-500">Log in</a>
        </p>
        </div>
          </div>
          <Footer/>
        </div>
      </main>
    );
  }
  