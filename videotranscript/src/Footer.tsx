import React from 'react'

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-100 dark:bg-gray-800 text-center">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          © {new Date().getFullYear()} Copyright
        </p>
      </footer>
  )
}

export default Footer;