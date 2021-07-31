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


interface LineProps2 {

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
        type: number[];
        notation: string;

    }[]
    previous: number;
    max: number;
    min: number;

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


    const [enabledLinesEx1, setEnabledLines] = useState<number[]>(
        !!localStorage?.getItem('enabledLinesEx1') ? JSON.parse(localStorage.getItem('enabledLinesEx1')) : arrayRange(12, 22)

    )

    const [enabledTypesEx1, setEnabledTypes] = useState<EnabledTypesProps[]>(

        !!localStorage?.getItem('enabledTypesEx1') ? JSON.parse(localStorage.getItem('enabledTypesEx1')) :
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


    const handleSetEnabledTypes = (_enabledTypesEx1: EnabledTypesProps[]) => {
        setEnabledTypes(_enabledTypesEx1);
        localStorage?.setItem("enabledTypesEx1", JSON.stringify(_enabledTypesEx1));
    }

    const handleEnableNoteType = (index: number, type: number) => {

        if (!!enabledTypesEx1.filter(f => f.index == index && f.type == type)) {

            handleSetEnabledTypes(enabledTypesEx1.map(e => {

                if (e.index == index && e.type == type) {
                    return {
                        ...e, enabled: !e.enabled
                    }
                }

                return e
            }))

            handleSetEnabledLines(enabledLinesEx1.filter(line => line !== index))

        } else {
            handleSetEnabledLines([...enabledLinesEx1, index])
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
            const currentEnabledType = enabledTypesEx1.filter(f => f.index == line.index && f.enabled)

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

        generateRandomQuestions(selectedNote)
        

    }


    const generateRandomQuestions = (_selectedNoteIndex: number) => {

        let _questions = [
            { name: "Do", code: "C", correct: false },
            { name: "Re", code: "D", correct: false },
            { name: "Mi", code: "E", correct: false },
            { name: "Fa", code: "F", correct: false },
            { name: "Sol", code: "G", correct: false },
            { name: "La", code: "A", correct: false },
            { name: "Si", code: "B", correct: false },
        ]

        const letters = ["A","B", "C", "D", "E", "F", "G"]

        let actual_letter = 2;

        switch (clef) {
            case "sol":
                actual_letter = 2;
                break;
            case "fa":
                actual_letter = 4;
                break;
            case "do":
                actual_letter = 3;
                break;
            default:
                actual_letter = 2; // default SOL(G)
        }


        const _Clef = [...new Array(abcNotationArray.length)].map((_, i) => {

            actual_letter--;
            if (actual_letter < 0) {
                actual_letter = letters.length - 1;
            } else {

            }
            return letters[actual_letter];

        })

        setQuestions(_questions.map(q => {

            return {
                ...q,
                correct: _Clef[_selectedNoteIndex - 1] === q.code
            }
        }))

        setSelectedAnswer("")

        console.log("Cruzes",_questions)

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


    const handleSetEnabledLines = (_enabledLinesEx1: number[]) => {
        setEnabledLines(_enabledLinesEx1);
        localStorage?.setItem("enabledLinesEx1", JSON.stringify(_enabledLinesEx1));
    }

    const handleSaveClef = (_clef: string) => {

        const valid_clefs = ["sol", "fa", "do"]

        if (valid_clefs.includes(_clef)) {
            setClef(_clef);
            localStorage?.setItem("clef_ex2", _clef);
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

                    <Select fontWeight="bold" variant="filled" w="140px" value={clef} onChange={(e) => handleSaveClef(e.target.value)} >

                        <option value="sol">G clef</option>
                        <option value="fa">F clef</option>
                        <option value="do">C clef</option>

                    </Select>
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

                                    const enabled = !!enabledTypesEx1.find(f => f.index === note.index && f.type === 1 && f.enabled) ? true : false;

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
