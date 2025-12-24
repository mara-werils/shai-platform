import React from 'react'

import './style.css'
type ILoadingProps = {
  type?: 'area' | 'app'
}
const Loading = (
  { type = 'area' }: ILoadingProps = { type: 'area' },
) => {
  return (
    <div className={`flex w-full items-center justify-center ${type === 'app' ? 'h-full' : ''}`}>
      <div className="ping"></div>
    </div>
  )
}
export default Loading
