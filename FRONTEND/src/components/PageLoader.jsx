import { LoaderIcon } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
        <LoaderIcon className='size-10 animate-spin'/>
    </div>
  )
}

export default PageLoader