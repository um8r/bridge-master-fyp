import { motion } from "framer-motion";

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  isChecked: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ leftLabel, rightLabel, isChecked, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm ${!isChecked ? "text-green-400" : "text-gray-400"}`}>{leftLabel}</span>
      <motion.div
        className="w-14 h-8 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer"
        onClick={onToggle}
        role="switch"
        aria-checked={isChecked}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggle();
          }
        }}
      >
        <motion.div
          className="w-6 h-6 bg-green-400 rounded-full shadow-md"
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          animate={{ x: isChecked ? 24 : 0 }}
        />
      </motion.div>
      <span className={`text-sm ${isChecked ? "text-green-400" : "text-gray-400"}`}>{rightLabel}</span>
    </div>
  );
}
