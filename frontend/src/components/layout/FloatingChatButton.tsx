import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDarkMode } from "../../contexts/DarkModeContext";

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/chat")}
      className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl transition-all ${isDark ? "bg-violet-600 hover:bg-violet-700" : "bg-gradient-to-br from-indigo-500 to-violet-500"}`}
      title="Open Chat Assistant"
    >
      <MessageCircle size={24} />
    </motion.button>
  );
}
