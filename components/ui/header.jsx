import React from 'react'
import { SignInButton,SignedOut, UserButton, SignedIn } from '@clerk/nextjs';

const Header = () => {
  return (
    <div className="fixed top-0">
        <nav>
            <Link href="/">
                <Image/>
            </Link>
        </nav>
        <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
    </div>
  )
}

export default Header