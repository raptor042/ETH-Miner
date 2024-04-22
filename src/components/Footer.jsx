"use client"

import React from 'react'
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className='flex items-center justify-between gap-4 flex-col md:flex-row text-slate-100 text-sm my-5 md:mt-12 mt-4'>
            <p>Copyright © 2024 PROFIT-IQ <span className="text-[#D9B504]">($PRIQ)</span> . All rights reserved.
            </p>

            <div className="social-icons flex items-center gap-7 text-lg">
                <a href="https://t.me/profit_IQ"><FaTelegramPlane className='transition-all hover:text-[#D9B504] hover:scale-150' /></a>
                <a href="https://twitter.com/profit_IQERC"><FaTwitter className='transition-all hover:text-[#D9B504] hover:scale-150' /></a>
            </div>

        </footer>
    )
}

export default Footer