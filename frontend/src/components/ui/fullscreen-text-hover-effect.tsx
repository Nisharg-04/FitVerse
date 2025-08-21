import { useEffect } from "react";
import { animate } from "framer-motion";

export const FullscreenTextHoverEffect = ({ items }: { items: string[] }) => {
  useEffect(() => {
    let currentIndex = 0;
    
    const rotateText = async () => {
      const textElement = document.getElementById('animatedText');
      if (!textElement) return;

      // Fade out current text
      await animate(textElement, 
        { opacity: 0, y: 20 }, 
        { duration: 0.5 }
      );

      // Update text
      textElement.textContent = items[currentIndex];
      currentIndex = (currentIndex + 1) % items.length;

      // Fade in new text
      await animate(textElement, 
        { opacity: 1, y: 0 }, 
        { duration: 0.5 }
      );

      // Wait before next rotation
      setTimeout(rotateText, 3000);
    };

    rotateText();
  }, [items]);

  return (
    <h1 
      id="animatedText"
      className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 opacity-0"
    >
      {items[0]}
    </h1>
  );
};
