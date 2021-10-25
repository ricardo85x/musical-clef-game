type lessonType = "1" | "2"

interface LessonProps {
    page: lessonType
}

import { Lesson1 } from "../../components/Lesson1"
import { Lesson2 } from "../../components/Lesson2"

const Lesson = ( { page } : LessonProps ) => {

    const Lessons = {
        "1": Lesson1,
        "2": Lesson2
    }

    const CurrentLesson = Lessons[page]
  
    return <CurrentLesson  />
  
};

export const getServerSideProps = async ({query}) => {

    const { id } = query

    let page : lessonType  = "1"

    // check if is number, bigger than 1 smaller than 3
    // so it it stay in the lessonType list
    if( id && Number(id) !== NaN && Number(id) > 1 && Number(id) < 3) {
        page = id
    }

    return { props: { page } };
};


export default Lesson