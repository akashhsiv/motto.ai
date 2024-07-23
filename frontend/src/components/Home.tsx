import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
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
  Skeleton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { RespAppBar } from "./RespAppBar";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ParticlesComponent from "./ParticlesBackground";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  sender: "user" | "ai";
}

export const Home: React.FC = () => {
  const authHeader = useAuthHeader();
   const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement>(null);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setLoading(true);

      try {
        const response = await axios.post(
          "https://motto-ai-be.vercel.app/api/chatbot/",
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
        if (axios.isAxiosError(error) && error.response) {
          if (
            error.response.data.detail ===
            "Authentication credentials were not provided."
          ) {
            navigate("/login");
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Please log in again.", sender: "ai" },
            ]);
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Error sending message", sender: "ai" },
            ]);
          }
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Error sending message", sender: "ai" },
          ]);
        }
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
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
        maxWidth={"xl"}
        sx={{
          mt: 4,
          height: isMobile ? "90vh" : isTablet ? "80vh" : 600,
          mb: 4,
          width: "98%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "transparent",
          borderRadius: "6px",
          boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)`,
          position: "relative",
          overflow: "hidden",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiInputBase-input": {
            "&::placeholder": {
              color: "white",
            },
            color: "white",
          },
        }}
      >
        <ParticlesComponent />

        <Typography
          sx={{
            textAlign: "center",
            pt: 4,
            color: "white",
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
            height: isMobile ? "70vh" : isTablet ? "60vh" : 430,
            width: isMobile ? "100%" : isTablet ? 720 : 920,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
            borderRadius: "6px",
            position: "relative",
            zIndex: 1, // Ensure chat area is on top of the particles
          }}
        >
          <List
            ref={listRef}
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
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
                    px: 2,
                    borderRadius: 8,
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
            {loading && (
              <ListItem
                sx={{
                  justifyContent: "flex-start",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={210}
                  height={60}
                  sx={{ borderRadius: 8, animation: "pulse 1.5s infinite" }}
                />
              </ListItem>
            )}
          </List>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              color="primary"
              variant="outlined"
              placeholder="Type a message"
              value={input}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              sx={{ flexGrow: 1, marginRight: 1, input: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
            <IconButton color="secondary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
