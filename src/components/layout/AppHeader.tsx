"use client"

import UserDropdown from "@/components/header/UserDropdown"
import { useSidebar } from "@/context/SidebarContext"
import { AlignLeft, X } from "lucide-react"
import React, { useEffect,useRef } from "react"

const AppHeader: React.FC = () => {
  // const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false)

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar()
    } else {
      toggleMobileSidebar()
    }
  }

  // const toggleApplicationMenu = () => {
  //   setApplicationMenuOpen(!isApplicationMenuOpen)
  // }
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:hidden lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <X/>
            ) : (
              <AlignLeft/>
            )}
            {/* Cross Icon */}
          </button>
{/* 
          <Link href="/" className="lg:hidden">
            <div>Calendar</div>
          </Link> */}
{/* 
          <button
            // onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <User/>
          </button> */}
          <div className="lg:hidden">
            <UserDropdown /> 
          </div>

      
        </div>
        <div
          className={`hidden lg:flex items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          {/* <!-- User Area --> */}
          <UserDropdown /> 
    
        </div>

      </div>
    </header>
  )
}

export default AppHeader
