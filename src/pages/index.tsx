import { Flex, Box, Text, Icon, Select, usePrefersReducedMotion, keyframes, Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import { AiTwotoneCheckCircle} from "react-icons/ai"

interface NotesProps {

    notes: {
        index: number;
        hasNote: boolean;
    }[],

    previous: number;
    position: number;

}

interface LineProps {

    notes: {
        index: number;
        enabled: boolean;
        additional: boolean;
        hasNote: boolean;
        hasLine: boolean;
        base: boolean;
        normalNote: boolean;
        sharpNote: boolean;
        flatNote: boolean;
    }[]
    previous: number;

}


// type LineProps = {
//     index: number;
//     enabled: boolean;
// }




const arrayRange = (from: number, to: number) => {
    if (to > from) {
        return Array(to - from + 1).fill(0).map((_, i) => i + from);
    }
    return []

}

export default function Home() {


    const [secondsInterval, setSecondsInterval] = useState(3)
    const [enabledLines, setEnabledLines] = useState<number[]>(arrayRange(12, 22))

    const componentLinesRef = useRef(null);


    const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11 })

    const linesRef = useRef<LineProps>({ notes: [], previous: 11 })


    const handleEnableNote = (index: number) => {

        if (enabledLines.includes(index)) {
            console.log("removendo", index)
            setEnabledLines(enabledLines.filter(line => line !== index))

        } else {
            console.log("adicionando", index)
            setEnabledLines([...enabledLines, index])
        }



        // setLines({
        //     ...lines,
        //     notes: [
        //         ...lines.notes.map(line => {
        //             if(line.index === index){
        //                 return {...line, enabled: line.enabled ? false : true}
        //             }
        //             return line
        //         })
        //     ]
        // })
    }


    const loadRandomNotes = () => {

        let _lines = [...new Array(11 + 9 + 11)].map((_, i) => {
            return {
                index: i + 1,
                enabled: false,
                additional: false,
                hasNote: false,
                hasLine: false,
                base: false,
                normalNote: false,
                sharpNote: false,
                flatNote: false,
            }
        }).map(line => {
            return {
                ...line,
                // enabled: arrayRange(10, 20).includes(line.index),
                enabled: enabledLines.includes(line.index),
                additional: [
                    ...
                    arrayRange(1, 10),
                    ...arrayRange(21, 32)
                ].includes(line.index),
                hasLine: line.index % 2 == 0,
                base: arrayRange(12, 22).includes(line.index),

            }
        })

        const validIndexes = _lines.filter(
            line => line.enabled &&
                line.index !== linesRef.current.previous
        ).map(line => line.index)

        const selectedIndex = Math.floor(Math.random() * validIndexes.length);
        const selectedNote = validIndexes[selectedIndex]


        console.log("previous", linesRef.current.previous)
        console.log("new", selectedNote)



        linesRef.current = {
            notes: _lines.map(line => {
                return {
                    ...line,
                    hasNote: selectedNote === line.index
                }
            }),
            previous: selectedNote
        }

        setLines(linesRef.current)


    }


    useEffect(() => {

        console.log("OPA!")

        if (secondsInterval > 0) {
            const interval = setInterval(() => {
                loadRandomNotes()
            }, 1000 * secondsInterval)

            return () => {
                clearInterval(interval);
            }
        }

    }, [secondsInterval, enabledLines])


    useEffect(() => {
        loadRandomNotes();
    }, [])


    const noteTextSize = 6;


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



            <Flex gridGap="2" direction="row" width="100%" align="center" justify="center">
                <Text fontSize="28" fontWeight="medium" pb="2">The random({lines.previous}) Claf </Text>
                <Select w="200px" defaultValue={secondsInterval ? secondsInterval : 3} onChange={(e) => setSecondsInterval(Number(e.target.value))} >
                    <option value={0.5} key={0.5}>0.5 seconds</option>
                    {[...new Array(10)].map((_, s) => (
                        <option value={s + 1} key={s}>{`${s + 1} seconds`}</option>
                    ))}
                </Select>



                <Menu>
                    <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                        Natural Flat
                    </MenuButton>
                    <MenuList align="center">

                        {lines.notes.map((note) => (


                            <Box width="100%" align="center"
                            
                            
                            cursor="pointer"
                            _hover={{
                                backgroundColor: "red.400"
                            }}

                            onClick={() => handleEnableNote(note.index)}

                                >

<Flex
                                direction="row"
                                align="center"
                                justify="center"

                                _after={note.hasLine ? {
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: "auto",
                                    content: '""',
                                    height: 0,
                                    borderBottom: `2px solid ${note.enabled ? "green" : "black"}`,

                                    marginLeft: `-${noteTextSize}`
                                } : {}}

                                _before={note.hasLine ? {
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: "auto",
                                    content: '""',
                                    height: 0,
                                    borderBottom: `2px solid ${note.enabled ? "green" : "black"}`,
                                    marginRight: `-${noteTextSize}`

                                } : {}}

                                // display={note.enabled === false && note.additional ? "none": "inherit"} 


                                w={note.additional ? "50px" : "200px"}

                                key={note.index}


                                

                            >


                                <Box

                                    color={`${note.enabled ? "green" : "black"}`}


                                    
                                >
                                    <Icon w={noteTextSize} h={noteTextSize} as={IoMusicalNote} />
                                </Box>




                            </Flex>

                            </Box>
                            
                            




                            // <MenuItem 
                            //     key={note.index} 
                            //     value={note.index}  
                            //     backgroundColor={note.enabled ? "green.300" : "inherit"}

                            //     borderBottom="2px solid red"
                            //     borderBottomWidth="1px"

                            //     onClick={() => handleEnableNote(note.index)}

                            // > 
                            //     # <Icon as={IoMusicalNote} /> 
                            // </MenuItem>
                        ))}

                    </MenuList>
                </Menu>


            </Flex>

            <Box
                w="100%"
                ref={componentLinesRef}
                align="center"
            >

                {lines.notes.map((note) => (
                    <Flex
                        direction="row"
                        align="center"
                        justify="center"

                        _after={note.hasLine ? {
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: "auto",
                            content: '""',
                            height: 0,
                            borderBottom: `2px solid ${note.enabled ? "green" : "black"}`,

                            marginLeft: `-${noteTextSize}`
                        } : {}}

                        _before={note.hasLine ? {
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: "auto",
                            content: '""',
                            height: 0,
                            borderBottom: `2px solid ${note.enabled ? "green" : "black"}`,
                            marginRight: `-${noteTextSize}`

                        } : {}}

                        // display={note.enabled === false && note.additional ? "none": "inherit"} 


                        w={note.additional ? "100px" : "100%"}

                        key={note.index} >


                        <Text w={noteTextSize} minW={noteTextSize} h={noteTextSize} >
                            {note.hasNote && <Icon animation={fadeOutAnimation} w={noteTextSize} h={noteTextSize} as={IoMusicalNote} />}
                        </Text>


                    </Flex>
                ))}


            </Box>




        </Flex>
    )

}
