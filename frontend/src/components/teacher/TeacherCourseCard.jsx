import { Button } from "@material-tailwind/react";

const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';
const profilePic1 = 'https://getwallpapers.com/wallpaper/full/8/f/8/562880.jpg';

const TeacherCourseCard = ({ course, onclick}) => {
  return (
    <div className='h-56 w-64'>
        <div className="h-3/4 w-full bg-gray-400 rounded-t-lg bg-cover bg-center cursor-pointer" onClick={onclick} >
            <img className="w-full h-full object-cover rounded-t-lg" src={course ? course?.coverImage?.url : profilePic1} alt="" />
        </div>
        <div className="h-1/4 w-full bg-gray-300 rounded-b-lg flex justify-center items-center gap-4 font-bold text-base">
            {course && course?.title}
        </div>
    </div>
  )
}

export default TeacherCourseCard
