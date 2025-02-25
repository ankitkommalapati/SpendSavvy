"use client";
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const HeroSection = () => {
    const imageRef=useRef();
    useEffect(()=>{
        const imageElement=imageRef.current;
        const handleScroll=()=>{
            const scrollPosition=window.scrollY;
            const scrollThreshold=100;
            if (scrollPosition>scrollThreshold){
                imageElement.classList.add("scrolled");
            }
            else{
                imageElement.classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    },[])
  return (
    <div className='pb-20 px-4'>
        <div className='container mx-auto text-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-8 gradient-title'>Manage Your Finances <br /> with Intelligence</h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
                An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.
            </p>
            <div className='flex justify-center space-x-4'>
                <Link href="/dashboard">
                    <Button className="px-8" size="lg">
                        Get Started
                    </Button>
                </Link>
            </div>
            <div className='hero-image-wrapper'>
                <div ref={imageRef} className='hero-image'>
                    <Image
                        src="/Banner.png" 
                        width={880} height={720} 
                        alt="Banner"
                        className='rounded-lg shadow-2xl border mx-auto' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection