import { motion, MotionValue, useTransform } from "motion/react";

interface EditorialMonogramProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function EditorialMonogram({ mouseX, mouseY }: EditorialMonogramProps) {
  // Deep background inverse parallax offset
  const monoX = useTransform(mouseX, [0, 1], [18, -18]);
  const monoY = useTransform(mouseY, [0, 1], [18, -18]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: monoX, y: monoY }}
      className="editorial-monogram absolute -left-6 sm:-left-12 -top-10 sm:-top-16 pointer-events-none select-none z-0 opacity-[0.05] text-primary dark:text-primary/70 font-display font-bold leading-none tracking-tighter text-[16rem] sm:text-[22rem] lg:text-[28rem] overflow-hidden"
    >
      MH
    </motion.div>
  );
}
