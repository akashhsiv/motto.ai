import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { RespAppBar } from "./RespAppBar";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ParticlesComponent from "./ParticlesBackground";

interface Message {
  text: string;
  sender: "user" | "ai";
}

export const Home: React.FC = () => {
  const authHeader = useAuthHeader();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/chatbot/",
          { input },
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );

        const aiMessage =
          response.data?.message || "Sorry, no response from AI.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiMessage, sender: "ai" },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error sending message", sender: "ai" },
        ]);
        console.error("Error sending message:", error);
      }
    }
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the form from submitting
      handleSendMessage();
    }
  };

  return (
    <>
      <RespAppBar />
      <Container
        // component={"img"}
        // src=""
        maxWidth={"xl"}
        sx={{
          mt: 4,
          height: 600,
          mb: 4,
          width: "98%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "transparent", // Make container background transparent
          borderRadius: "6px",
          boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ParticlesComponent />

        <Typography
          sx={{
            textAlign: "center",
            pt: 4,
            color: "black",
            fontFamily: "Outfit",
            position: "relative",
            zIndex: 1, // Ensure text is on top of the particles
          }}
          variant="h5"
          gutterBottom
        >
          Are You feeling down today? <br />
          Here I am!!
        </Typography>
        <Box
          sx={{
            height: 430,
            width: 920,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
            borderRadius: "6px",
            // border: `1px solid black`,
            position: "relative",
            zIndex: 1, // Ensure chat area is on top of the particles
          }}
        >
          <List sx={{ overflowY: "auto", flexGrow: 1 }}>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    backgroundColor:
                      msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText primary={msg.text} />
                </Paper>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Type a message"
              value={input}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              sx={{ flexGrow: 1, marginRight: 1 }}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};
