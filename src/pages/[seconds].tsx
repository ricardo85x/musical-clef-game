import { Flex, Box, Text, Icon, Select } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5"

import { useRouter } from "next/router"

interface NotesProps {

    notes: {
        index: number;
        hasNote: boolean;
    }[],

    previous: number;
    position: number;

}

export default function Home() {

    const router = useRouter();

    const { seconds } = router.query

    const [secondsInterval, setSecondsInterval] = useState(Number(seconds) === NaN ? 5 : Number(seconds))

    const initialValue = { notes: [], previous: 1, position: 1 }

    const [notes, setNotes] = useState<NotesProps>(initialValue);

    const notesRef = useRef<NotesProps>(initialValue)

    const loadRandomNotes = () => {

        const nNotes = 4;

        let randomNote = 1;

        const validNotes = [...new Array(nNotes)]
            .map((_, i) => i + 1)
            .filter(item => item !== notesRef.current.previous)

        randomNote = validNotes[Math.floor(Math.random() * (nNotes - 1))]

        console.log("actual note", randomNote)

        const position = Math.floor(Math.random() * 3);

        const musicNotes = [
            ...
            new Array(nNotes)].map((_, i) => {
                const index = i + 1;
                return {
                    index,
                    hasNote: randomNote === index,
                }
            }
            )

        notesRef.current = {
            notes: musicNotes,
            previous: randomNote,
            position
        }

        setNotes(notesRef.current)

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


    const noteTextSize = 20;

    return (
        <Flex align="center" justify="center" direction="column" >

            <Select defaultValue={secondsInterval} onChange={(e) => setSecondsInterval(Number(e.target.value))} >
                <option value={0.5} key={0.5}>{`0.5 seconds`}</option>
                {[...new Array(10)].map((_, s) => (
                    <option value={s + 1} key={s}>{`${s + 1} seconds`}</option>
                ))}
            </Select>

            <Text fontSize="28" fontWeight="medium" pb={`${noteTextSize * 2}`}>The random Claf {secondsInterval}</Text>

            {notes.notes.map((note) => (
                <Box align="center" borderTop="1px" w="100%" key={note.index} >
                    {
                        <Text w={noteTextSize} h={noteTextSize}>
                            {note.hasNote && <Icon position={notes.position === 0 ? "inherit" : "relative"} marginTop={notes.position === 0 ? "0" : notes.position === 1 ? `${noteTextSize / 2}` : `${(noteTextSize / 2) * -1}`} w={noteTextSize} h={noteTextSize} as={IoMusicalNote} />}
                        </Text>

                    }
                </Box>
            ))}

            <Box align="center" borderBottom="1px" w="100%" key="last">
            </Box>

        </Flex>
    )

}
