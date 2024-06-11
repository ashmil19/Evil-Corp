import React from 'react'
import { IconButton, Typography } from "@material-tailwind/react";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

const SimplePagination = () => {

    const [active, setActive] = React.useState(1);
 
    const next = () => {
        if (active === 10) return;
    
        setActive(active + 1);
    };
    
    const prev = () => {
        if (active === 1) return;
    
        setActive(active - 1);
    };

  return (
    <div className="flex items-center gap-4 px-8 justify-center">
      <IconButton
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={active === 1}
      >
        <FaArrowLeft strokeWidth={2} className="text-white h-4 w-4" />
      </IconButton>
      <Typography color="gray" className="font-normal">
        Page <strong className="text-white">{active}</strong> of{" "}
        <strong className="text-white">10</strong>
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={active === 10}
      >
        <FaArrowRight strokeWidth className="text-white h-4 w-4" />
      </IconButton>
    </div>
  )
}

export default SimplePagination
