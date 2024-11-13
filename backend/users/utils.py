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
            """a) Use a conversational tone, concise language and avoid unnecessarily complex jargon.

b) Use short punchy sentences. Example: "And then... you enter the

room. Your heart drops. The pressure is on."

c) Use simple language. 10th grade readability or lower. Example: "Emails help businesses tell customers about their stuff."

d) Use rhetorical fragments to improve readability. Example: "The good news? My 3-step process can be applied to any business

e) Use bullet points when relevant. Example: "Because anytime someone loves your product, chances are they'll:

* buy from you again * refer you to their friends"

f) Use analogies or examples often. Example: "Creating an email course with Al is easier than stealing candies from a baby" g) Split up long sentences. Example: "Even if you make your clients an

offer they decline...[break]...you shouldn't give up on the deal." h) Include personal anecdotes. Example: "I recently asked ChatGPT to

write me...

i) Use bold and italic formatting to emphasize words.

j) Do not use emojis or hashtags k) Avoid overly promotional words like "game-changing," "unlock,"

"master," "skyrocket," or "revolutionize." ) Important - vary sentences length within a paragraph""",
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
