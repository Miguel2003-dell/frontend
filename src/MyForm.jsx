import React, { useState, useEffect } from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Textarea,
} from "@chakra-ui/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

export default function MyForm() {
    const animatedComponents = makeAnimated();

    const [users, setUsers] = useState([]);
    const [to, setTo] = useState([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const baseUrl = "http://localhost:5000";

    const handleToChange = (selectedOptions) => {
        setTo(selectedOptions.map(option => option.value));
    };

    const sendEmail = async () => {
        let dataSend = {
            emails: to,
            subject: subject,
            message: message,
        };

        console.log(dataSend);

        const res = await fetch(`${baseUrl}/api/sendEmail`, {
            method: "POST",
            body: JSON.stringify(dataSend),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        // HANDLING ERRORS
        .then((res) => {
            console.log(res);
            if (res.status > 199 && res.status < 300) {
                alert("Send Successfully !");
            }
        });
    };

    useEffect(() => {
        fetch(`${baseUrl}/api/users`)
            .then((response) => response.json())
            .then((data) => {
                const formattedEmails = data.data.map((user) => ({
                    value: user.email,
                    label: user.email,
                }));
                setUsers(formattedEmails);
            })
            .catch((error) =>
                console.error("Error fetching users:", error)
            );
    }, []);

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>
                        Send email to the account
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email addresses</FormLabel>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={users}
                                onChange={handleToChange}
                                placeholder="Select Receiver's Email Addresses"
                            />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Subject</FormLabel>
                            <Input
                                onChange={(e) => setSubject(e.target.value)}
                                type="text"
                                placeholder="Enter the subject here..."
                            />
                        </FormControl>
                        <FormControl id="text">
                            <FormLabel>Message</FormLabel>
                            <Textarea
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter your message here..."
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                bg={"blue.400"}
                                color={"white"}
                                _hover={{
                                    bg: "blue.500",
                                }}
                                onClick={() => sendEmail()}
                            >
                                Send Email
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
