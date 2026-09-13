const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

const oldScrollLogic = `  const [isVisible, setIsVisible] = useState(true);
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

const newScrollLogic = `  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollStartRef = useRef(0);
  const directionRef = useRef('UP');

  useEffect(() => {
    const handleScroll = () => {
      // Only apply this dynamic hide/show logic on mobile screens (width < 768px)
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        setLastScrollY(window.scrollY);
        return;
      }

      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN
        if (directionRef.current === 'UP') {
          directionRef.current = 'DOWN';
          scrollStartRef.current = currentScrollY;
        }
        
        // Slowly hide on continuous scroll down by at least 150px
        if (currentScrollY - scrollStartRef.current > 150 && currentScrollY > 150) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP
        if (directionRef.current === 'DOWN') {
          directionRef.current = 'UP';
          scrollStartRef.current = currentScrollY;
        }
        
        // Reappear on continuous scroll up by at least 150px
        if (scrollStartRef.current - currentScrollY > 150) {
          setIsVisible(true);
        }
      }
      
      // Always show when at the absolute top of the page
      if (currentScrollY <= 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);`;

code = code.replace(oldScrollLogic, newScrollLogic);

code = code.replace(
  /<header className="sticky top-0 z-40 bg-white\/95 backdrop-blur border-b border-slate-200 shadow-xs">/,
  "<header className={`sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs transition-transform duration-700 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>"
);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Mobile scroll logic patched');
