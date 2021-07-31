import { Flex, Box, Grid, Text, Icon, RadioGroup, Radio, Select, Button, Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { IoMusicalNote } from "react-icons/io5"
import { FiChevronDown } from "react-icons/fi"
import Router from "next/router";
import dynamic from 'next/dynamic';

const AbcJSComponent = dynamic(() => import('../components/AbcJS'), {
    ssr: false
})

interface EnabledTypesProps {
    index: number,
    type: number,
    enabled: boolean,
}

interface NoteProps {
        index: number;
        enabled: boolean;
        additional: boolean;
        hasNote: boolean;
        hasLine: boolean;
        base: boolean;
        type: number[];
        notation: string;
        answer?: string;
}


interface LineProps {

    notes: NoteProps[]
    previous: number;

}


interface AbcNotationProps {
    notation: string;
    note: string
}

const arrayRange = (from: number, to: number) => {
    if (to > from) {
        return Array(to - from + 1).fill(0).map((_, i) => i + from);
    }
    return []
}


export default function Home() {

    const toast = useToast()

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


    const [noteTextSize, setNoteTextSize] = useState<number>(
        !!localStorage?.getItem('noteTextSize') ? JSON.parse(localStorage.getItem('noteTextSize')) : 6
    );


    const [enabledLinesLesson2, setEnabledLines] = useState<number[]>(
        !!localStorage?.getItem('enabledLinesLesson2') ? JSON.parse(localStorage.getItem('enabledLinesLesson2')) : arrayRange(12, 22)

    )

    const [enabledTypesLesson2, setEnabledTypes] = useState<EnabledTypesProps[]>(

        !!localStorage?.getItem('enabledTypesLesson2') ? JSON.parse(localStorage.getItem('enabledTypesLesson2')) :
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

    const componentLinesRef = useRef(null);

    const [lines, setLines] = useState<LineProps>({ notes: [], previous: 11 })

    const linesRef = useRef<LineProps>({ notes: [], previous: 11 })

    const [questions, setQuestions] = useState<{
        name: string,
        code: string,
        correct: boolean,
    }[]>([])

    const [selectedAnswer, setSelectedAnswer] = useState<string>("")

    const [clef, setClef] = useState<string>(
        !!localStorage?.getItem('clef_ex2') ? localStorage.getItem('clef_ex2') : "sol"
    );


    const handleSetEnabledTypes = (_enabledTypesLesson2: EnabledTypesProps[]) => {
        setEnabledTypes(_enabledTypesLesson2);
        localStorage?.setItem("enabledTypesLesson2", JSON.stringify(_enabledTypesLesson2));
    }

    const handleEnableNoteType = (index: number, type: number) => {

        if (!!enabledTypesLesson2.filter(f => f.index == index && f.type == type)) {

            handleSetEnabledTypes(enabledTypesLesson2.map(e => {

                if (e.index == index && e.type == type) {
                    return {
                        ...e, enabled: !e.enabled
                    }
                }

                return e
            }))

            handleSetEnabledLines(enabledLinesLesson2.filter(line => line !== index))

        } else {
            handleSetEnabledLines([...enabledLinesLesson2, index])
        }

        loadRandomNotes()

    }



    const loadRandomNotes = (_clef?: string) => {

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
            const currentEnabledType = enabledTypesLesson2.filter(f => f.index == line.index && f.enabled)

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
                
                // bass = F
                // treble = G
                // alto = C 3
                // tenor = C 4
                // perc = bateria

                const clefNotation = {
                    sol: "treble",
                    fa: "bass",
                    do: "alto"
                }

                return {
                    ...line,
                    hasNote: selectedNote === line.index,
                    notation: selectedNote === line.index ? 
                    `
                        X:1
                        K: clef=${clefNotation[_clef ? _clef : clef ]}
                        ${accident}${abcNotationArray[line.index - 1]}
                    ` : 
                    line.notation,
                    answer: selectedNote === line.index ? 
                        abcNotationArray[line.index - 1]:
                        ''
                }
            }),
            previous: selectedNote
           
        }

        setLines(linesRef.current)

        generateRandomQuestions()
        

    }


    const generateRandomQuestions = () => {

        const currentNote = linesRef.current.notes.find(
            n => n.hasNote && linesRef.current.previous == n.index
        )

        let answer = "";

        if(currentNote?.answer){
            const m1 = currentNote.answer.match(/(\w)/)
            if (m1){
                answer = m1[1].toUpperCase()
            }
        }

        const _questions = [
            { name: "Do", code: "C", correct: false },
            { name: "Re", code: "D", correct: false },
            { name: "Mi", code: "E", correct: false },
            { name: "Fa", code: "F", correct: false },
            { name: "Sol", code: "G", correct: false },
            { name: "La", code: "A", correct: false },
            { name: "Si", code: "B", correct: false },
        ].map(q => {
            return {
                ...q,
                correct: answer === q.code
            }
        })
    
        setQuestions(_questions)
        setSelectedAnswer("")
    }


    useEffect(() => {
        loadRandomNotes();
    }, [])


    const handleSelectQuestion = (selected: string) => {

        setSelectedAnswer(selected)

        if (questions.find(f => f.code === selected && f.correct)) {
            toast({
                title: "Correct!",
                status: "success",
                duration: 1000 * 1
            })
        } else {
            toast({
                title: "Wrong Answer!",
                status: "error",
                duration: 1000 * 1
            })
        }

        setTimeout(
            () => {
                loadRandomNotes()
            }, 1000 * 1 // wait 1 seconds
        )
    }


    const handleSetEnabledLines = (_enabledLinesLesson2: number[]) => {
        setEnabledLines(_enabledLinesLesson2);
        localStorage?.setItem("enabledLinesLesson2", JSON.stringify(_enabledLinesLesson2));
    }

    const handleSaveClef = (_clef: string) => {

        const valid_clefs = ["sol", "fa", "do"]

        if (valid_clefs.includes(_clef)) {
            setClef(_clef);
            localStorage?.setItem("clef_ex2", _clef);
            loadRandomNotes(_clef)
        }

    }


    const handleKeyPress = (event) => {

        if (["A", "B", "C", "D", "E", "F", "G"].includes(event.key.toUpperCase())) {
            handleSelectQuestion(event.key.toUpperCase())
        }
    }

    return (
        <Flex align="center" justify="center" direction="column"
            onKeyDown={handleKeyPress}
            tabIndex={0}
        >

            <Flex backgroundColor="gray.200" w="100%" gridGap="2" flexWrap="wrap" direction="row" width="100%" align="flex-start" justify={["center", "center", "space-between"]}>

                <Box p="3" >
                    <Text fontSize="28" fontWeight="medium" pb="2">{app_tittle}</Text>
                </Box>

                <Flex
                    p="3"
                    gridGap="2" flexWrap="wrap" direction="row" align="center" justify="center"
                >

                    <Menu >
                        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                            Lesson 2
                        </MenuButton>
                        <MenuList
                            align="center"
                            minW="139px"
                            backgroundColor="gray.100"
                        >
                            <MenuItem onClick={() => Router.push("/")}>Lesson 1</MenuItem>
                            <MenuItem >Lesson 2</MenuItem>
                        </MenuList>
                    </Menu>

                    {/* <Select disabled fontWeight="bold" variant="filled" w="140px" value={clef} onChange={(e) => handleSaveClef(e.target.value)} >

                        <option value="sol">G clef</option>
                        <option disabled value="fa">F clef</option>
                        <option disabled value="do">C clef</option>

                    </Select> */}
                    {[...new Array(1)].map((_, m) => (
                        <Menu key={`menu_${m + 1}`}>
                            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                                Notes
                            </MenuButton>
                            <MenuList
                                align="center"
                                minW="139px"
                                backgroundColor="gray.100"
                            >
                                {lines.notes.map((note) => {

                                    const enabled = !!enabledTypesLesson2.find(f => f.index === note.index && f.type === 1 && f.enabled) ? true : false;

                                    return (
                                        <Box
                                            align="center"
                                            key={note.index}
                                            backgroundColor={enabled ? "green.100" : "inherit"}
                                            cursor="pointer"
                                            _hover={{
                                                backgroundColor: "green.400"
                                            }}

                                            onClick={() => handleEnableNoteType(note.index, 1)}

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
                                                    <Icon w={6} h={6} as={IoMusicalNote} />

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

            {/* <AbcJSComponent 
                    notation={
                        `X:1
                        K: clef=treble 
                        [b'a'g'f'e'd'c'bag fedcBAGFE DCB,A,G,F,E,D,C,]
                    `}
                    /> */}

            <Text fontWeight="medium" fontSize="20" p={5}>Select the Right Answer </Text>

            <RadioGroup m={4} maxWidth="300" width="100%" defaultValue="" value={selectedAnswer} onChange={(_value) => handleSelectQuestion(_value)} >

                <Grid templateColumns="1fr 1fr 1fr" >

                    {questions.map((q, i) => (
                        <Radio key={i} colorScheme={q.correct ? "green" : "red"} value={q.code}>
                            <Text fontSize="20" fontWeight="medium">{q.code} - {q.name}</Text>
                        </Radio>
                    ))}

                </Grid>

            </RadioGroup>

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
