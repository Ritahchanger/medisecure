import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        fixed bottom-6 left-6 
        bg-blue-600 text-white 
        px-4 py-2 
        rounded-full shadow-lg 
        flex items-center gap-2
        hover:bg-blue-700 
        transition
      "
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
};

export default BackButton;
