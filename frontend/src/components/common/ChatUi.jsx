import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import io from "socket.io-client";
import {Button} from "@material-tailwind/react"

import useAxiosPrivate from "../../hooks/useAxiosPrivate"

const socket = io("http://localhost:3000");

const ChatUi = ({ recipientId, recipient }) => {
    const axiosPrivate = useAxiosPrivate()
    const authState = useSelector(state => state.auth)


    const [conversationId, setConversationId] = useState(null)
    const [allMessages, setAllMessages] = useState(null)
    const [textMessage, setTextMessage] = useState("");

    const handleSendMessage = () => {
        if (textMessage.trim() === "") {
            alert("fill the form")
            return
        }
        const newMessage = {
            // senderId: authState.userId,
            content: textMessage,
            timeStamps: new Date().toISOString(),
            sender: {
                _id: authState.userId,
            }
        }

        console.log(newMessage);
        if (allMessages) {
            setAllMessages(prevMessages => [...prevMessages, newMessage])
        } else {
            setAllMessages([...allMessages,newMessage])
        }

        console.log("d",conversationId);
        socket.emit("sendMessage", {
            textMessage,
            conversationId,
            recipientId,
            senderSocketId: socket.id,
            token: authState.accessToken
        })

        setTextMessage("")
    }

    useEffect(() => {

        (async () => {
            const data = await axiosPrivate.get(`/chat/message/${recipientId}`)

            console.log(data);
            setConversationId(data?.data?.conversationId)

            setAllMessages(data?.data?.messages)

            socket.emit('joinRoom', data?.data?.conversationId)

        })()

        console.log("haii");

        return () => {
            socket.off("receiveMessage")
        };

    }, [recipientId]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            const newMessage = {
                senderId: authState.userId,
                content: data.textMessage,
                timeStamps: new Date().toISOString()
            }

            setAllMessages(prevMessages => [...prevMessages, newMessage])
        })

        return () => {
            socket.off('receiveMessage');
        };
    })

    return (
        <>
            <div className="bg-red-500 p-4 rounded-t-2xl">{recipient?.fullname}</div>
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-b-2xl bg-gray-300 h-full p-4">
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                    <div className="flex flex-col h-full">
                        <div className="grid grid-cols-12 gap-y-2">
                            {allMessages && allMessages.map((message) => (

                                message?.sender?._id === authState?.userId ?
                                    <div className="col-start-6 col-end-13 p-3 rounded-lg" >
                                        <div className="flex items-center justify-start flex-row-reverse">
                                            {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                            {message?.sender?.fullname[0]}
                                            </div> */}
                                            <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                <div>{message.content}</div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    < div className="col-start-1 col-end-8 p-3 rounded-lg" >
                                        <div className="flex flex-row items-center">
                                            {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                {message?.sender?.fullname[0]}
                                            </div> */}
                                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                <div>{message?.content}</div>
                                            </div>
                                        </div>
                                    </div>


                            ))}

                            {/* <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                        <div>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit. Vel ipsa commodi illum saepe numquam maxime
                                            asperiores voluptate sit, minima perspiciatis.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                <div className="flex items-center justify-start flex-row-reverse">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                        <div>Im ok what about you?</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                <div className="flex items-center justify-start flex-row-reverse">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                        <div>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing.
                                            ?
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                        <div>Lorem ipsum dolor sit amet !</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                <div className="flex items-center justify-start flex-row-reverse">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                        <div>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing.
                                            ?
                                        </div>
                                        <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                                            Seen
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                        A
                                    </div>
                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                        <div>
                                            Lorem ipsum dolor sit amet consectetur adipisicing
                                            elit. Perspiciatis, in.
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                    <div>
                        <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex-grow ml-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                            />
                            <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="ml-4">
                        <Button disabled={textMessage.trim() === "" ? true : false}  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0" onClick={handleSendMessage}>
                            <span>Send</span>
                            <span className="ml-2">
                                <svg
                                    className="w-4 h-4 transform rotate-45 -mt-px"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    ></path>
                                </svg>
                            </span>
                        </Button>
                    </div>
                </div>
            </div >

        </>
    )
}

export default ChatUi
