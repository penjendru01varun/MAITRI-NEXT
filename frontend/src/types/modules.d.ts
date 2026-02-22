// Only declare modules that are genuinely missing types.
// jotai, framer-motion, three, lucide-react, @react-three/* all ship their own types
// — do NOT redeclare them here or it erases their real typings.
declare module 'canvas-confetti';
