import React from 'react'
import ProgressBar from "@ramonak/react-progress-bar";

const Progress = ({ value }) => {
  return (
    <ProgressBar 
      completed={value}
      maxCompleted={100}
      bgColor="#1e40af"
      height="10px"
      isLabelVisible={false}
    />
   
  )
}

export default Progress
