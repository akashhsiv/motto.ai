from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
import os
import dotenv
from langchain_openai import ChatOpenAI

dotenv.load_dotenv()
model = ChatOpenAI(model="gpt-3.5-turbo-0125")

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Motivate the user, be friendly with them, make them feel comfortable around you, and give quotes according to the situation. Be kind."
        ),
        ("placeholder", "{chat_history}"),
        ("user", "{input}"),
    ]
)

# Using ephemeral chat history for demo purposes
demo_ephemeral_chat_history = ChatMessageHistory()

# Combine prompt and model
chain = prompt | model

# Integrate with message history
chain_with_message_history = RunnableWithMessageHistory(
    chain,
    lambda session_id: demo_ephemeral_chat_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)

def chat_bot(input):
    response = chain_with_message_history.invoke(
        {"input": input},
        {"configurable": {"session_id": "unused"}},
    )
    return response['text']  # Adjusted to use 'text' if response is a dictionary

# Test the chatbot
if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        bot_response = chat_bot(user_input)
        print("Bot:", bot_response)