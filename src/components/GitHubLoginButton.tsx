import { FaGithubSquare } from "react-icons/fa";
import { SiGithubcopilot } from "react-icons/si";
type LoginWithGithubProps = {
  text?: "signin_with" | "signup_with" | "continue_with";
};
const GitHubLoginButton = ({ text }: LoginWithGithubProps) => {
  // const handleGitHubLogin = () => {
  const clientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID;

  const handleGithubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user user:email`;
    window.location.href = githubAuthUrl; // redirect user
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="bg-[#202124] cursor-pointer gap-x-2 w-full text-white flex items-center h-10 py-2 rounded-md hover:bg-[#202124]/80 transition"
    >
      <FaGithubSquare size={40} />{" "}
      <span className="text-white/80">{text?.replace("_", " ")} Github</span>
    </button>
  );
};

export default GitHubLoginButton;
