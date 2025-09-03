import { useLocation, useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  return {
    goTo,
    goBack,
    goHome,
    isCurrentPath,
    getCurrentPath,
    currentPath: location.pathname,
  };
}
