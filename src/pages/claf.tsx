import { Flex, Box, Text, Icon, Select, usePrefersReducedMotion, keyframes } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5"

interface NotesProps {

    notes: {
        index: number;
        hasNote: boolean;
    }[],

    previous: number;
    position: number;

}

interface LineProps {
    index: number;
    enabled: boolean;
    additional: boolean;
    hasNote: boolean;
    hasLine: boolean
}


// type LineProps = {
//     index: number;
//     enabled: boolean;
// }

const arrayRange = (from:number, to:number) => {
    if(to>from){
        return Array(to-from).fill(0).map((_, i) => i + from);
    }
    return []

}

export default function Home() {


    const [secondsInterval, setSecondsInterval] = useState(30)
    const [previousLine, setPreviousLine] = useState(15)


    const [lines, setLines] = useState<LineProps[]>([])

    const linesRef = useRef<LineProps[]>([])
    const previousLineRef = useRef<number>(15)


    const loadRandomNotes = () => {

        let _lines = [...new Array(11+9+11)].map((_,i) => {
            return {
                index: i+1,
                enabled: false,
                additional: false,
                hasNote: false,
                hasLine: false
            }
        }).map(line => {
            return {
                ...line,
                enabled: arrayRange(11,20).includes(line.index),
                additional: [
                    ...
                    arrayRange(1,10),
                    ...arrayRange(20,32)
                ].includes(line.index),
                hasLine: line.index % 2 == 0

            }
        })

        const validIndexes = _lines.filter(
            line => line.enabled && 
            line.index !== previousLine
        ).map(line => line.index)

        const selectedNote = validIndexes[Math.floor(Math.random() * validIndexes.length -1)]
        
        console.log("selectedNote", selectedNote)
        
        linesRef.current = _lines.map(line => {
            return {
                ...line,
                hasNote: selectedNote === line.index
            }
        })
        setLines(linesRef.current )

        previousLineRef.current = selectedNote

        setPreviousLine(previousLineRef.current)

    }

  
    useEffect(() => {

        if (secondsInterval > 0) {
            const interval = setInterval(() => {
                loadRandomNotes()
            }, 1000 * secondsInterval)

            return () => {
                clearInterval(interval);
            }
        }

    }, [secondsInterval])


    useEffect(() => {
        loadRandomNotes();
    }, [])


    const noteTextSize = 5;


    const fadeOut = keyframes`
        0% { opacity: 1; }
        100% { opacity: 0; }
    `;

    const prefersReducedMotion = usePrefersReducedMotion()

    const fadeOutAnimation = prefersReducedMotion
        ? undefined
        : `${fadeOut} ${secondsInterval}s linear normal forwards`;

    return (
        <Flex align="center" justify="center" direction="column" >

            <Select defaultValue={secondsInterval ? secondsInterval : 3} onChange={(e) => setSecondsInterval(Number(e.target.value))} >
                <option value={0.5} key={0.5}>0.5 seconds</option>
                {[...new Array(10)].map((_, s) => (
                    <option value={s + 1} key={s}>{`${s + 1} seconds`}</option>
                ))}
            </Select>

            <Text fontSize="28" fontWeight="medium" pb={`${noteTextSize * 2}`}>The random({previousLine}) Claf {secondsInterval} seconds</Text>


            {lines.map((note) => (
                <Flex 
                    direction="row" 
                    align="center" 
                    justify="center" 

                    _after={note.hasLine ?{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: "auto",
                        content: '""',
                        height: 0,
                        borderBottom: "1px solid black",

                        marginLeft: `-${noteTextSize}`
                    }: {}}

                    _before={ note.hasLine ?{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: "auto",
                        content: '""',
                        height: 0,
                        borderBottom: "1px solid black",
                        marginRight: `-${noteTextSize}`

                    } : {}}

                    
                    w={note.additional ? "100px" : "100%"} 
                    key={note.index} >
                        

                         <Text w={noteTextSize} h={noteTextSize}>

                           {note.hasNote && <Icon  animation={fadeOutAnimation}  w={noteTextSize} h={noteTextSize} as={IoMusicalNote} />}
                        </Text>

                    
                </Flex>
            ))}

        

        </Flex>
    )

}
