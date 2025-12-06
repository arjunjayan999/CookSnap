import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/pantry");
    } else {
      navigate("/");
    }
  }, []);

  return <div>Signing you in…</div>;
}
