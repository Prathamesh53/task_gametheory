import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom"; 
import { useTheme } from "./theme-provider";

export default function Header() {
  const [status, setStatus] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  let timerId: NodeJS.Timeout;
  useEffect(() => {
    if (showStatus) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setShowStatus(false);
      }, 5000)
    }
  }, [showStatus])


  const onlineEvent = () => {
    setShowStatus(true);
    setStatus(true);
  }
  const offlineEvent = () => {
    setShowStatus(true);
    setStatus(false);
  }
  useEffect(() => {
    window.addEventListener('online', onlineEvent);
    window.addEventListener('offline', offlineEvent);
    return () => {
      window.removeEventListener('online', onlineEvent);
      window.removeEventListener('offline', offlineEvent);
    }
  }, []) 
  const { theme,setTheme } = useTheme();
  const toggleTheme = ()=>{
    setTheme(theme=='light'?'dark':'light');
  }
  return (
    <div>
      <div className={`h-max ${status ? 'bg-green-700' : 'bg-red-700'} text-white w-dvw absolute text-center text-sm py-1 ${showStatus ? 'top-0' : '-top-8'} transition-all`}>
        {
          status ? 'Back Online' : 'Trying to reconnecting...'
        }
      </div>
      <nav className="w-full h-[60px] bg-gray-400 dark:bg-gray-900 text-white p-3 flex justify-between items-center">
        <Link to="/">
          <h2 className="font-bold select-none text-gray-800 dark:text-white">BookMyGround</h2>
        </Link>
        
        <div>
        <button type="button" onClick={toggleTheme} className={`hs-dark-mode hs-dark-mode-active:hidden inline-flex items-center ${theme==='light'?'hidden':''} gap-x-2 py-2 px-3 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 focus:outline-none focus:bg-white/20`} data-hs-theme-click-value="dark">
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
          Dark
        </button>
        <button type="button" onClick={toggleTheme} className={`hs-dark-mode flex hs-dark-mode-active:inline-flex ${theme==='light'?'':'hidden'} items-center gap-x-2 py-2 px-3 bg-white/10 rounded-full text-sm text-gray-800 hover:bg-white/20 focus:outline-none focus:bg-white/20" data-hs-theme-click-value="light`}>
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
          Light
        </button>
        </div>
      </nav>
    </div>
  );
}
