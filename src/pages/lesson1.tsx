import { 
    Flex, ButtonGroup, IconButton, Box, Text, Icon, 
    Select, Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"

import { useEffect, useRef, useState } from "react";
import { MdMusicNote } from "react-icons/md"
import { FiChevronDown } from "react-icons/fi"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import Router from "next/router"
import { ProgressBeat } from "../components/ProgressBeat"

import dynamic from 'next/dynamic';

const AbcJSComponent = dynamic(() => import('../components/AbcJS'), {
    ssr: false
})


interface EnabledTypesProps {
    index: number,
    type: number,
    enabled: boolean,
}

interface LineProps {

    notes: {
        index: number;
        enabled: boolean;
        additional: boolean;
        hasNote: boolean;
        hasLine: boolean;
        base: boolean;
        type: number[];
        notation: string;
    }[]
    previous: number;

}

const arrayRange = (from: number, to: number) => {
    if (to > from) {
        return Array(to - from + 1).fill(0).map((_, i) => i + from);
    }
    return []
}

export default function Home() {

    const app_tittle = "Smart Music Notes";

    const abcNotationArray = [
        "b'", "a'", "g'", "f'","e'", "d'", "c'", "b", "a", "g",
        "f", "e", "d", "c", "B", "A", "G", "F", "E",
        "D", "C", "B,", "A,", "G,", "F", "E,", "D,", "C,"
    ]

    let localStorage: Storage;

    if (typeof window !== 'undefined') {
        // You now have access to `window`
        localStorage = window.localStorage;
    }

    const defaultCookieOptions = {
        maxAge: 60 * 60 * 24 * 30,// 30 days
        path: "/" // valid on whole app
    }


    const [noteTextSizeLesson1, setNoteTextSize] = useState<number>(
        !!localStorage?.getItem('noteTextSizeLesson1') ? JSON.parse(localStorage.getItem('noteTextSizeLesson1')) : 6
    );

    const listIntervals = [
        0.5,0.75,1,1.25,1.5,1.75,2,3,4,5,6,7,8,9,10
    ]

    const [secondsIntervalLesson1, setSecondsInterval] = useState(
        !!localStorage?.getItem('secondsIntervalLesson1') ? JSON.parse(localStorage.getItem('secondsIntervalLesson1')) : 3
    )

    const [enabledLinesLesson1, setEnabledLines] = useState<number[]>(
        !!localStorage?.getItem('enabledLinesLesson1') ? JSON.parse(localStorage.getItem('enabledLinesLesson1')) : arrayRange(12, 22)

    )

    const [enabledTypesLesson1, setEnabledTypes] = useState<EnabledTypesProps[]>(

        !!localStorage?.getItem('enabledTypesLesson1') ? JSON.parse(localStorage.getItem('enabledTypesLesson1')) :
            [...[...[...new Array(abcNotationArray.length)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 0,
                    enabled: false,
                    notation: `
                    X:1
                    L:1/4
                    _${abcNotationArray[i]}
                    `
                }
            }), ...[...new Array(abcNotationArray.length)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 1,
                    enabled: arrayRange(11, 19).includes(i + 1),
                    notation: `
                    X:1
                    L:1/4
                    ${abcNotationArray[i]}
                    `

                }
            })], ...[...new Array(abcNotationArray.length)].map((_, i) => {
                return {
                    index: i + 1,
                    type: 2,
                    enabled: false,
                    notation: `
                    X:1
                    L:1/4
                    ^${abcNotationArray[i]}
                    `

                }
            })]
    )


    const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11 })

    const linesRef = useRef<LineProps>({ notes: [], previous: 11 })


    const handleSetEnabledTypes = (_enabledTypesLesson1: EnabledTypesProps[]) => {
        setEnabledTypes(_enabledTypesLesson1);
        localStorage?.setItem("enabledTypesLesson1", JSON.stringify(_enabledTypesLesson1));
    }

    const handleEnableNoteType = (index: number, type: number) => {

        if (!!enabledTypesLesson1.filter(f => f.index == index && f.type == type)) {

            handleSetEnabledTypes(enabledTypesLesson1.map(e => {

                if (e.index == index && e.type == type) {
                    return {
                        ...e, enabled: !e.enabled
                    }
                }

                return e
            }))

            handleSetEnabledLines(enabledLinesLesson1.filter(line => line !== index))

        } else {
            handleSetEnabledLines([...enabledLinesLesson1, index])
        }

        loadRandomNotes()

    }


    const loadRandomNotes = () => {

        let _lines = [...new Array(abcNotationArray.length)].map((_, i) => {
            return {
                index: i + 1,
                enabled: false,
                additional: false,
                hasNote: false,
                hasLine: false,
                base: false,
               
                notation: "E",
                type: [1]
            }
        }).map(line => {

            // check if enabledType array has index enabled, no mather the type.
            const currentEnabledType = enabledTypesLesson1.filter(f => f.index == line.index && f.enabled)

            return {
                ...line,
                enabled: !!currentEnabledType.length,
                additional: [
                    ...
                    arrayRange(1, 10),
                    ...arrayRange(20, abcNotationArray.length)
                ].includes(line.index),
                hasLine: line.index % 2 !== 0,
                base: arrayRange(11, 19).includes(line.index),
                type: !!currentEnabledType.length ?
                    currentEnabledType.map(e => e.type) : [1]
            }
            
        })

       

        const validIndexes = _lines.filter(
            line => line.enabled &&
                line.index !== linesRef.current.previous
        ).map(line => line.index)

        const selectedIndex = Math.floor(Math.random() * validIndexes.length);

        const selectedNote = validIndexes[selectedIndex]

        linesRef.current = {
            notes: _lines.map(line => {

                const random_accident_type = line.type[
                    Math.floor(Math.random() * line.type.length)
                ]

                const accident = random_accident_type === 0 ?
                "_" : random_accident_type === 2 ?
                "^" : "";


                return {
                    ...line,
                    hasNote: selectedNote === line.index,
                    notation: selectedNote === line.index ? 
                    `
                        X:1
                        L:1/4
                        ${accident}${abcNotationArray[line.index - 1]}
                    ` : 
                    line.notation
                }
            }),
            previous: selectedNote
           
        }

        setLines(linesRef.current)
        

    }

    useEffect(() => {

        if (secondsIntervalLesson1 > 0) {
            const interval = setInterval(() => {
                loadRandomNotes()
            }, 1000 * secondsIntervalLesson1)

            return () => {
                clearInterval(interval);
            }
        }

    }, [secondsIntervalLesson1, enabledLinesLesson1])


    useEffect(() => {
        loadRandomNotes();
    }, [])


    const handleSetSecondsInterval = (_interval: any) => {

        const valid_interval = Number(_interval);

        if (valid_interval !== NaN) {
            setSecondsInterval(valid_interval)
            localStorage?.setItem("secondsIntervalLesson1", `${valid_interval}`);
        }

    }


    const handleSetEnabledLines = (_enabledLinesLesson1: number[]) => {
        setEnabledLines(_enabledLinesLesson1);
        localStorage?.setItem("enabledLinesLesson1", JSON.stringify(_enabledLinesLesson1));
    }

    
    return (
        <Flex align="center" justify="center" direction="column" >

            <Flex backgroundColor="gray.200" w="100%" gridGap="2" flexWrap="wrap" direction="row" width="100%" align="flex-start" justify={["center", "center", "space-between"]}>

                <Box p="3" >
                    <Text fontSize="28" fontWeight="medium" pb="2">{app_tittle}</Text>
                </Box>

                <Flex
                    p="3"
                    gridGap="2" flexWrap="wrap" direction="row" align="center" justify="center"
                >   

                    <Menu  >
                        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                            Lesson 1
                        </MenuButton>
                        <MenuList
                            align="center"
                            minW="139px"
                            backgroundColor="gray.100"
                        >
                            <MenuItem >Lesson 1</MenuItem>
                            <MenuItem onClick={() => Router.push("/lesson2")}>Lesson 2</MenuItem>
                        </MenuList>
                    </Menu>


                    <Select fontWeight="bold" variant="filled" w="140px" value={secondsIntervalLesson1} onChange={(e) => handleSetSecondsInterval(e.target.value)} >

                        {listIntervals.map(i => (
                            <option value={i} key={i}>{`${i} seconds`}</option>
                        ))}

                    </Select>

                    {[...new Array(3)].map((_, m) => (
                        <Menu key={`menu_${m + 1}`}>
                            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                                {m === 0 ? "Flat Notes" : m === 1 ? "Natural Notes" : "Sharp Notes"}
                            </MenuButton>
                            <MenuList
                                align="center"
                                minW="139px"
                                backgroundColor="gray.100"
                            >
                                {lines.notes.map((note) => {

                                    const enabled = !!enabledTypesLesson1.find(f => f.index === note.index && f.type === m && f.enabled) ? true : false;

                                    return (
                                        <Box
                                            align="center"
                                            key={note.index}
                                            backgroundColor={enabled ? "green.100" : "inherit"}
                                            cursor="pointer"
                                            _hover={{
                                                backgroundColor: "green.400"
                                            }}

                                            onClick={() => handleEnableNoteType(note.index, m)}

                                            title="Enable/Disable item to learn"

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
                                                    borderBottom: `2px solid ${enabled ? "green" : "black"}`,

                                                    marginLeft: `-6`
                                                } : {}}

                                                _before={note.hasLine ? {
                                                    flexGrow: 1,
                                                    flexShrink: 1,
                                                    flexBasis: "auto",
                                                    content: '""',
                                                    height: 0,
                                                    borderBottom: `2px solid ${enabled ? "green" : "black"}`,
                                                    marginRight: `-6`

                                                } : {}}

                                                w={note.additional ? "50px" : "90%"}

                                            >
                                                <Box
                                                    color={`${!!enabled ? "green" : "black"}`}
                                                >
                                                    {m == 0 ? "b" : m == 2 && "#"}
                                                    <Icon w={6} h={6} as={MdMusicNote} />



                                                    {/* <Icon w={noteTextSizeLesson1} h={noteTextSizeLesson1} as={IoMusicalNote} /> */}




                                                </Box>
                                            </Flex>
                                        </Box>

                                    )
                                })}

                            </MenuList>
                        </Menu>
                    ))}

                </Flex>




            </Flex>
            
            <Box pt={5} width="100%" align="center" justify="center" >
                <ProgressBeat count={lines.previous}  time={secondsIntervalLesson1} />
            </Box>

            <Box width="100%" align="center" justify="center">
                <AbcJSComponent 
                    notation={
                        lines.notes.find(f => f.enabled && f.hasNote) ? 
                        lines.notes.find(f => f.enabled && f.hasNote).notation:
                        ""
                    }
                />
            </Box>


        </Flex>
    )
}
