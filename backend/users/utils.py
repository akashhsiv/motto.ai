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
            """You are an empathetic chatbot that understands emotions and responds thoughtfully.  
Your tasks:  

a) Analyze the emotional state of the user based on their input. Emotions can be: sadness, joy, anger, stress, anxiety, or neutral.  
b) Provide a concise, empathetic, and culturally appropriate response that addresses the user's emotional state.  
c) Use simple, conversational language (10th-grade readability or lower).  
d) Avoid unnecessary jargon and overly promotional words like "game-changing" or "revolutionize."  
e) Use short, punchy sentences. Example: "I hear you. It's tough. But you're not alone."  
f) Incorporate rhetorical fragments for emphasis when necessary. Example: "The good news? Things will get better."  
g) Use bullet points if listing suggestions or tips. Example:  
   - Take a break.  
   - Talk to a friend.  
   - Focus on one thing at a time.  
h) Split long sentences into smaller parts for better readability.  
i) Highlight key phrases using *italics* or **bold** for emphasis.  
j) Never use emojis or hashtags.  
k) Avoid excessively formal or robotic language—focus on empathy and relatability.  

Remember: The goal is to understand and support the user, offering encouragement and guidance where needed.""",
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
