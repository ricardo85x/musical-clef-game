import {
  Flex,
  Box,
  Icon,
  Select,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { MdMusicNote } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import Router from "next/router";
import { EnabledTypesProps, LineProps } from "./types";

interface MenuComponentProps {
  secondsIntervalLesson1: number;
  handleSetSecondsInterval: (value: string) => void;
  listIntervals: number[];
  lines: LineProps;
  enabledTypesLesson1: EnabledTypesProps[];
  handleEnableNoteType: (index: number, type: number) => void;
  beatsToSeconds: (beats: number) => number;
}

export const MenuButtons = ({
  secondsIntervalLesson1,
  handleSetSecondsInterval,
  listIntervals,
  lines,
  enabledTypesLesson1,
  handleEnableNoteType, beatsToSeconds
}: MenuComponentProps) => {


  return (
    <Flex
      p="3"
      gridGap="2"
      flexWrap="wrap"
      direction="row"
      align="center"
      justify="center"
    >
      <Menu id="menu_00001" isLazy>
        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
          Lesson 1
        </MenuButton>
        <MenuList align="center" minW="139px" backgroundColor="gray.100">
          <MenuItem>Lesson 1</MenuItem>
          <MenuItem onClick={() => Router.push("/lesson/2")}>Lesson 2</MenuItem>
        </MenuList>
      </Menu>

      <Select
        fontWeight="bold"
        variant="filled"
        w="140px"
        value={beatsToSeconds(secondsIntervalLesson1)}
        onChange={(e) => handleSetSecondsInterval(e.target.value)}
      >
        {listIntervals.map((i) => (
          <option value={i} key={i}>{`${i} BPM`}</option>
        ))}
      </Select>

      {[...new Array(3)].map((_, m) => (
        <Menu id="menu_00002" isLazy key={`menu_${m + 1}`}>
          <MenuButton as={Button} rightIcon={<FiChevronDown />}>
            {m === 0 ? "Flat Notes" : m === 1 ? "Natural Notes" : "Sharp Notes"}
          </MenuButton>
          <MenuList align="center" minW="139px" backgroundColor="gray.100">
            {lines.notes.map((note) => {
              const enabled = !!enabledTypesLesson1.find(
                (f) => f.index === note.index && f.type === m && f.enabled
              )
                ? true
                : false;

              return (
                <Box
                  align="center"
                  key={note.index}
                  backgroundColor={enabled ? "green.100" : "inherit"}
                  cursor="pointer"
                  _hover={{
                    backgroundColor: "green.400",
                  }}
                  onClick={() => handleEnableNoteType(note.index, m)}
                  title="Enable/Disable item to learn"
                >
                  <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    _after={
                      note.hasLine
                        ? {
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: "auto",
                            content: '""',
                            height: 0,
                            borderBottom: `2px solid ${
                              enabled ? "green" : "black"
                            }`,

                            marginLeft: `-6`,
                          }
                        : {}
                    }
                    _before={
                      note.hasLine
                        ? {
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: "auto",
                            content: '""',
                            height: 0,
                            borderBottom: `2px solid ${
                              enabled ? "green" : "black"
                            }`,
                            marginRight: `-6`,
                          }
                        : {}
                    }
                    w={note.additional ? "50px" : "90%"}
                  >
                    <Box color={`${!!enabled ? "green" : "black"}`}>
                      {m == 0 ? "b" : m == 2 && "#"}
                      <Icon w={6} h={6} as={MdMusicNote} />
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </MenuList>
        </Menu>
      ))}
    </Flex>
  );
};
