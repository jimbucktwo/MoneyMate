import Header from "../components/header";
import Footer from "../components/footer";
import { useUser, UserProfile, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/account";
import { getAuth } from "@clerk/react-router/ssr.server";

export async function loader(context: Route.LoaderArgs) {
  let data = {};
  const { userId } = await getAuth(context);
  if (!userId) {
    return redirect("/landing");
  }

  try {
    // Fetch assigned user
    const response = await fetch(
      `${process.env.VITE_PUBLIC_BACKEND_URL}/users/get_user/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch assigned budgets. Status: ${response.status}`
      );
    }

    // Parse the response as JSON
    data = await response.json();
    console.log("Fetched data:", data);
  } catch (err) {
    console.error("Error fetching assigned routines:", err);
  }
  return data;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [profile, setProfile] = useState(true);
  const [settings, setSettings] = useState(false);
  const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [profilePicture, setProfilePicture] = useState(null);
const [error, setError] = useState("");

useEffect(() => {
  if (confirmPassword && confirmPassword !== newPassword) {
      setError("Passwords don't match" );
  } else {
      setError('');
  }
}, [confirmPassword, newPassword]);

  if (!isSignedIn) {
    redirect("/landing");
  }
  
  const updateUsernameClerk = async () => {
        await user?.update({
          username: username,})
      }

  const handleUsernameChange = async (event: any) => {
    event.preventDefault();
    const userId = user?.id;
    const response = await fetch(
      `${process.env.VITE_PUBLIC_BACKEND_URL}/users/update_username/${userId}?username=${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: username,
      }
    );
    if (response.ok) {
      updateUsernameClerk();
      alert("Username updated successfully!");
      setUsername('');
      console.log("Username updated successfully!");
    } else {
      console.error("Error updating username:", response.statusText);
    }
  }

  const handlePasswordChange = async (event: any) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try{
      await user?.updatePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        signOutOfOtherSessions: true,
      }); 
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
        alert("Current password is incorrect!");
        
      }
    
  }

  const clerkPictureChange = async () => {
    await user?.setProfileImage({
      file: profilePicture,
    }) }

  const handleProfilePictureChange = async (event: any) => {
    event.preventDefault();
    if (!profilePicture) {
      alert("Please select a profile picture to upload.");
      return;
    }
    clerkPictureChange();
    alert("Profile picture updated successfully!");
    setProfilePicture(null);
    window.location.reload();
  }

  const triggerSettings = () => {
    setProfile(false);
    setSettings(true);
  };

  const triggerProfile = () => {
    setProfile(true);
    setSettings(false);
  };

  return (
    <main className="flex items-center justify-center size-full">
      <div className="flex flex-col items-center space-y-4 size-full h-screen justify-between">
        <Header />
        <div className="p-6 flex flex-row items-start space-y-4 size-full h-auto justify-between bg-white shadow-lg">
          <div className="flex flex-col items-start space-y-4 w-1/7 h-full border-r-2 border-gray-200 pr-4">
            <h1 className="text-3xl font-bold text-left">
              Account Information
            </h1>
            <button
              onClick={() => triggerProfile()}
              className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200"
            >
              Profile
            </button>
            <button
              onClick={() => triggerSettings()}
              className="p-2 px-4 hover:bg-gray-300 hover:text-white hover:cursor-pointer rounded-full transition duration-200"
            >
              Settings
            </button>
            <SignOutButton>
              <p className="text-red-600 hover:bg-red-600 hover:text-white hover:cursor-pointer transition duraction-200 p-2 px-4 rounded-full">
                Logout
              </p>
            </SignOutButton>
          </div>
          {profile && (
            <div className="flex flex-row items-start space-y-4 w-6/7 h-full p-8 justify-start">
              <h1 className="text-3xl font-bold text-center absolute">
                Profile Information
              </h1>
              <div className="flex flex-col items-end space-y-4 w-1/2 h-full justify-center pr-8">
                <p>
                  <b>Username:</b> {user?.username}
                </p>
                <p>
                  <b>Full Name:</b> {user?.firstName} {user?.lastName}
                </p>
                <p>
                  <b>Email:</b> {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <div className="flex items-center justify-center w-1/7 h-full">
                <button className="w-full rounded-full overflow-hidden hover:cursor-pointer">
                  <img src={user?.imageUrl} className="rounded-full w-44 h-44" />
                </button>
              </div>
            </div>
          )}

          {settings && (
            <div className="flex flex-col items-start p-8 space-y-4 w-6/7 h-auto">
              <h1 className="text-3xl font-bold text-center">Settings</h1>
              <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Update Information
                </h2>
                <form className="space-y-4" onSubmit={handleUsernameChange}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your new username"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="hover:cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Save Username
                  </button>
                </form>
              </div>

              {/* Change Password Section */}
              <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form className="space-y-4" onSubmit={handlePasswordChange}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  </div>
                  <button
                    type="submit"
                    className="hover:cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Update Password
                  </button>
                </form>
              </div>
              <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Update Profile Picture
                </h2>
                <form className="space-y-4" onSubmit={handleProfilePictureChange}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={user?.imageUrl}
                      alt="Current Profile"
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                      className="block w-1/8 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <button
                    type="submit"
                    className="hover:cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Upload Picture
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
