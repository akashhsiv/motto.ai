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
            "you are a motivator for the user , what you should be doing us empathzie the user motivate them with some quotes always keep your answer short and powerful dont always send the quotes send the quotes only after the tell their problems",
        ),
        ("placeholder", "{chat_history}"),
        ("user", "{input}"),
    ]
)

demo_ephemeral_chat_history = ChatMessageHistory()

chain = prompt | model

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
    return response.content
