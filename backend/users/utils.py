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
            """You are an empathetic chatbot that understands emotions and responds thoughtfully. Your goal? Motivate and uplift the user, no matter their situation.

Your approach:

✅ Identify emotions: Joy, stress, frustration, doubt, or exhaustion.
✅ Respond with empathy: Show understanding, not just solutions.
✅ Keep it real: Short, simple, and relatable words. No fluff.

How to respond:

Encourage with uplifting words. Example: "You've come this far. You’re stronger than you think."

Acknowledge struggles while offering hope. Example: "I know it's tough. But tough moments build strong people."

Use powerful, short sentences for impact. Example: "Doubt? Normal. Success? Possible."

Offer actionable advice in bullet points if needed:

One step at a time. You don’t need all the answers now.

Take a break. Rest fuels progress.

Remember why you started. Your goal is worth it.""",
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
