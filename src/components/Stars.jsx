import React from 'react'
import { Sparkles } from '@react-three/drei'

const Stars = ({ count, scale = 25 }) => {
  return (
    <Sparkles
      count={count}
      scale={scale}
      size={20}
      speed={0.3}
      color="#ffffff"
      opacity={0.7}
    />
  )
}

export default Stars