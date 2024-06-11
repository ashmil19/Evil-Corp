import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Button } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ToastHelper from "../../helper/ToastHelper";

const socket = io("evilcorp.ashmil.shop", {
  transports: ["websocket", "polling"],
});

const ChatUi = ({ recipientId, recipient }) => {
  const toastHelper = new ToastHelper();
  const axiosPrivate = useAxiosPrivate();
  const authState = useSelector((state) => state.auth);

  const scrollRef = useRef();
  const fileInputRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);
  const [allMessages, setAllMessages] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [filePreview, setFilePreview] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const scrollToBottom = () => {
    scrollRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!(selectedFile?.type?.startsWith("image/"))) {
      toastHelper.showToast("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview({ dataURL: reader.result, type: selectedFile.type });
      console.log(typeof selectedFile.type);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSendMessage = () => {
    if (textMessage.trim() === "" && !filePreview) {
      alert("fill the form");
      return;
    }

    const newMessage = {
      // senderId: authState.userId,
      content: textMessage ? textMessage.trim() : filePreview.dataURL,
      type: filePreview ? filePreview.type : "String",
      timeStamps: new Date().toISOString(),
      sender: {
        _id: authState.userId,
      },
    };

    console.log(newMessage);
    if (allMessages) {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    } else {
      setAllMessages([newMessage]);
    }

    console.log("d", conversationId);
    socket.emit("sendMessage", {
      content: textMessage ? textMessage.trim() : filePreview.dataURL,
      type: filePreview ? filePreview.type : "String",
      conversationId,
      recipientId,
      senderSocketId: socket.id,
      token: authState.accessToken,
      userId: authState.userId,
    });

    setTextMessage("");
    setFilePreview(null);
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });

    const fetchChatMessage = async () => {
      const data = await axiosPrivate.get(`/chat/message/${recipientId}`);

      setConversationId(data?.data?.conversationId);

      setAllMessages(data?.data?.messages);

      if (socket.connected) {
        console.log("socket connected");
      } else {
        console.log("socket not connected");
      }

      socket.emit("joinRoom", data?.data?.conversationId);
    };

    fetchChatMessage();

    console.log("haii");

    return () => {
      socket.off("receiveMessage");
    };
  }, [recipientId]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      const newMessage = {
        senderId: authState.userId,
        content: data.content,
        type: data.type,
        timeStamps: new Date().toISOString(),
      };

      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  });

  return (
    <>
      <div className="rounded-t-2xl bg-red-500 p-4">{recipient?.fullname}</div>
      <div className="flex h-full flex-auto flex-shrink-0 flex-col rounded-b-2xl bg-gray-300 p-4">
        <div className="mb-4 flex h-full flex-col overflow-x-auto">
          <div className="flex h-full flex-col">
            <div className="grid grid-cols-12 gap-y-2" ref={scrollRef}>
              {allMessages &&
                allMessages.map((message) =>
                  message?.sender?._id === authState?.userId ? (
                    <div className="col-start-6 col-end-13 rounded-lg p-3">
                      <div className="flex flex-row-reverse items-center justify-start">
                        <div className="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow">
                          {message?.type === "String" ? (
                            <div>{message.content}</div>
                          ) : (
                            <img src={message.content} alt="Preview" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-start-1 col-end-8 rounded-lg p-3">
                      <div className="flex flex-row items-center">
                        <div className="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow">
                          {message?.type === "String" ? (
                            <div>{message.content}</div>
                          ) : (
                            <img src={message.content} alt="Preview" />
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              <div className="col-start-1 col-end-8 rounded-lg p-3">
                <div className="flex flex-row items-center"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-auto w-full flex-row items-center rounded-xl bg-white px-4">
          <div>
            <button
              className="flex items-center justify-center text-gray-400 hover:text-gray-600"
              onClick={handleButtonClick}
            >
              <svg
                className="h-5 w-5"
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
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </button>
          </div>
          {filePreview ? (
            <div className="p-5">
              <img src={filePreview.dataURL} alt="Preview" />
            </div>
          ) : (
            <div className="ml-4 flex-grow">
              <div className="relative w-full">
                <input
                  type="text"
                  className="flex h-12 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="ml-4">
            <Button
              disabled={
                textMessage.trim() === "" && !filePreview ? true : false
              }
              className="flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
              onClick={handleSendMessage}
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="-mt-px h-4 w-4 rotate-45 transform"
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
      </div>
      <Toaster />
    </>
  );
};

export default ChatUi;
