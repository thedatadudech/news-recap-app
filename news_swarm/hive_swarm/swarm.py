from hive_agent import HiveSwarm
from hive_swarm.tools import save_to_file, list_files, read_from_file, download_from_url


from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

from hive_agent.sdk_context import SDKContext


config_path = "./hive_swarm/hive_config.toml"
sdk_context = SDKContext(config_path=config_path)

livepeer_swarm = HiveSwarm(
    name="Livepeer Youtube Video Generator",
    description="A swarm of agents that collaborate as members of a News Recap Video Generator team.",
    instruction="""You are the manager of a video news production team for the Livepeer News Video Generator. Your goal is to guide the team in creating an engaging and informative video. Follow these steps:

    1. Coordinate with these agents in order:
       a. NewsTopic Gathering Agent
       b. Summarization Agent
       c. Text-to-Image Agent (max 3 files at a time)
       d. Image-to-Video Agent (max 3 files at a time)
       e. Text-to-Audio Agent (for audio)
       g. Video Compilation Agent
       h. Content Moderation Agent


    2. After each interaction with agents, save the output as a separate file in:
       `./hive-agent-data/output/<news_topic>/<agent_type>/`
       Use the save_to_file tool for this purpose.

    3. The Text-to-Image Agent and Image-to-Video Agent will return URLs or a list of URLs. You should use the download_from_url tool to download images and videos.

    4. Use list_files and read_from_file tools to access and review previous outputs.

    5. Ensure each agent receives the relevant input from the previous step, and adapt to the selected news category (Breaking News, Politics, Technology, Business, Science & Health, Entertainment, Sports) and the user's presentation style (Neutral, Formal Broadcast, Casual Explainer, Dynamic Report).

    6. Monitor the quality and relevance of each output, requesting revisions from agents if necessary to ensure the content fits the news recap theme.

    7. Maintain consistency and coherence throughout the video creation process, ensuring alignment between text, visuals, and audio.

    8. Provide clear, concise instructions to each agent, specifying their task, any relevant constraints (e.g., file limits, time duration), and any stylistic requirements (e.g., visual themes, transitions).

    9. After all steps are complete, review the entire project for cohesiveness and alignment with the original news topic and presentation style.

    """,
    functions=[save_to_file, list_files, read_from_file, download_from_url],
    sdk_context=sdk_context,
    max_iterations=1000,
)
