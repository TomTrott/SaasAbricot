import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.data.token;

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erreur login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Connexion
        </h1>

        <input
          className="border p-3 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-3 rounded"
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white p-3 rounded"
          onClick={handleLogin}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}