import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthPage = () => {
  const handleGoogleSignIn = async () => {
    if (!auth) {
        console.error("Firebase auth is not initialized.");
        alert("La connexion n'est pas disponible pour le moment.");
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bienvenue sur OfficeIA</h1>
        <p className="text-slate-500 mb-8">Connectez-vous pour continuer votre travail.</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition duration-300 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continuer avec Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
