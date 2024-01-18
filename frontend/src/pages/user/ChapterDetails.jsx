import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Navbar from '../../components/navbars/Navbar'

const ChapterDetails = () => {  
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const chapterId = location.state && location.state.id;

  const [chapter, setChapter] = useState(null);

  const fetchChapter = () =>{
    axiosPrivate.get(`/user/chapter/${chapterId}`)
    .then((res)=>{
        setChapter(res?.data?.chapter)
    })
    .catch((err)=>{
        console.log(err);
    })
  }

  useEffect(() => {
    fetchChapter()
  }, []);

  return (
    <div className='w-screen h-screen overflow-hidden'>
        <Navbar />
        <div className='w-full h-full px-4 pt-5 bg-white flex flex-col justify-start items-center gap-5'>
          <div className='max-h-[150px] px-2'>
            <div className='capitalize text-center text-3xl md:text-4xl font-semibold flex justify-center break-all'>{chapter && chapter.title}</div>
          </div>
          <video width="640" height="360" controls key={chapter?.video?.url}>
            {chapter?.video?.url && <source src={chapter.video.url} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
  )
}

export default ChapterDetails
