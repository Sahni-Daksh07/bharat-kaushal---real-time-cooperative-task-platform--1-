const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

if (!code.includes('useRef')) {
  code = code.replace(/import React, { useState, useEffect } from 'react';/, "import React, { useState, useEffect, useRef } from 'react';");
}

const oldScrollLogic = `  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down more than 50px, hide it. If we scroll up, show it.
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      // Always show at the very top
      if (currentScrollY <= 20) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);`;

const newScrollLogic = `  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollStartRef = useRef(0);
  const directionRef = useRef('UP');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        if (directionRef.current === 'UP') {
          directionRef.current = 'DOWN';
          scrollStartRef.current = currentScrollY;
        }
        
        // Hide only if we scrolled down at least 120px continuously without scrolling up
        if (currentScrollY - scrollStartRef.current > 120 && currentScrollY > 150) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        if (directionRef.current === 'DOWN') {
          directionRef.current = 'UP';
        }
        setIsVisible(true);
      }
      
      if (currentScrollY <= 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);`;

code = code.replace(oldScrollLogic, newScrollLogic);
fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Scroll logic updated with threshold');
