# { "Depends": "py-genlayer:test" }
from genlayer import *
import json


class SocialIntelligence(gl.Contract):
    """
    GenLayer Intelligent Contract for Social Intelligence.
    Fetches live data from X (Twitter) about @GenLayer,
    analyzes sentiment using LLM, and stores results on-chain.
    """

    # ── State Variables ──
    latest_posts: str           # JSON string of fetched posts
    latest_sentiment: str       # JSON string of sentiment analysis
    latest_mindshare: str       # JSON string of mindshare data
    query_count: int            # Total queries made
    last_query: str             # Last search query
    last_updated: str           # Timestamp of last update

    def __init__(self):
        self.latest_posts = "[]"
        self.latest_sentiment = json.dumps({
            "positive": 0, "neutral": 0, "negative": 0, "total": 0
        })
        self.latest_mindshare = "[]"
        self.query_count = 0
        self.last_query = ""
        self.last_updated = ""

    # ══════════════════════════════════════
    #  WRITE METHODS (require gas)
    # ══════════════════════════════════════

    @gl.public.write
    def fetch_genlayer_posts(self):
        """
        Fetch the latest posts about @GenLayer from X/Twitter.
        Uses GenLayer's native web access to read real web data.
        Validators verify the fetched content via equivalence principle.
        """
        def fetch_posts():
            # Fetch @GenLayer's X profile page
            web_data = gl.get_webpage(
                "https://x.com/GenLayer",
                mode="text"
            )
            # Return first 2000 chars for consensus
            return web_data[:2000]

        raw_content = gl.eq_principle_strict_eq(fetch_posts)

        # Store on-chain
        self.latest_posts = json.dumps({
            "source": "x.com/GenLayer",
            "content": raw_content,
            "query": "@GenLayer"
        })
        self.query_count += 1
        self.last_query = "@GenLayer"

        return self.latest_posts

    @gl.public.write
    def analyze_sentiment(self, topic: str):
        """
        Use LLM to analyze sentiment about a topic in the GenLayer ecosystem.
        Each validator independently runs the LLM and they reach consensus
        via strict equality on the normalized JSON output.
        """
        search_topic = topic if topic else "GenLayer"

        def run_sentiment_analysis():
            # Fetch web content about the topic
            url = f"https://x.com/search?q={search_topic}&f=live"
            web_data = gl.get_webpage(url, mode="text")

            # Use LLM to analyze sentiment
            prompt = f"""Analyze the sentiment of social media posts about "{search_topic}" based on this content.

Content from X/Twitter:
{web_data[:3000]}

Respond ONLY with this exact JSON format, nothing else:
{{"positive": <number 0-100>, "neutral": <number 0-100>, "negative": <number 0-100>, "total_posts": <number>, "summary": "<one sentence summary>"}}

Rules:
- positive + neutral + negative must equal 100
- total_posts is your estimate of posts analyzed
- Keep summary under 100 characters
"""
            result = gl.exec_prompt(prompt)
            # Clean LLM output
            cleaned = result.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(cleaned)
            # Normalize for consensus
            return json.dumps({
                "positive": int(parsed["positive"]),
                "neutral": int(parsed["neutral"]),
                "negative": int(parsed["negative"]),
                "total_posts": int(parsed["total_posts"]),
                "summary": str(parsed["summary"])[:100]
            }, sort_keys=True)

        result_str = gl.eq_principle_strict_eq(run_sentiment_analysis)
        self.latest_sentiment = result_str
        self.query_count += 1
        self.last_query = f"sentiment:{search_topic}"

        return result_str

    @gl.public.write
    def analyze_mindshare(self):
        """
        Analyze which accounts dominate the @GenLayer conversation.
        Fetches data from X and uses LLM to rank contributors.
        """
        def compute_mindshare():
            # Fetch GenLayer's X page
            web_data = gl.get_webpage(
                "https://x.com/GenLayer",
                mode="text"
            )

            prompt = f"""Based on this X/Twitter content about GenLayer, identify the top contributors and their estimated mindshare.

Content:
{web_data[:3000]}

Respond ONLY with this JSON array format:
[
  {{"username": "<handle>", "mindshare": <number 0-100>, "category": "<Core|Developer|Community|Ecosystem>"}}
]

Rules:
- List up to 5 top contributors
- mindshare values should sum to approximately 100
- Include @GenLayer as the first entry
"""
            result = gl.exec_prompt(prompt)
            cleaned = result.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(cleaned)
            # Normalize for consensus
            normalized = []
            for entry in parsed[:5]:
                normalized.append({
                    "username": str(entry["username"]),
                    "mindshare": int(entry["mindshare"]),
                    "category": str(entry.get("category", "Community"))
                })
            return json.dumps(normalized, sort_keys=True)

        result_str = gl.eq_principle_strict_eq(compute_mindshare)
        self.latest_mindshare = result_str
        self.query_count += 1
        self.last_query = "mindshare"

        return result_str

    @gl.public.write
    def search_topic(self, query: str):
        """
        Search for a specific topic related to GenLayer on the web.
        """
        search_query = query if query else "GenLayer"

        def search_web():
            url = f"https://x.com/search?q={search_query}%20GenLayer&f=live"
            web_data = gl.get_webpage(url, mode="text")
            return web_data[:2000]

        result = gl.eq_principle_strict_eq(search_web)

        self.latest_posts = json.dumps({
            "source": f"x.com/search?q={search_query}",
            "content": result,
            "query": search_query
        })
        self.query_count += 1
        self.last_query = search_query

        return self.latest_posts

    # ══════════════════════════════════════
    #  VIEW METHODS (free, no gas)
    # ══════════════════════════════════════

    @gl.public.view
    def get_latest_posts(self) -> str:
        """Get the latest fetched posts data."""
        return self.latest_posts

    @gl.public.view
    def get_sentiment(self) -> str:
        """Get the latest sentiment analysis."""
        return self.latest_sentiment

    @gl.public.view
    def get_mindshare(self) -> str:
        """Get the latest mindshare rankings."""
        return self.latest_mindshare

    @gl.public.view
    def get_stats(self) -> str:
        """Get contract usage statistics."""
        return json.dumps({
            "query_count": self.query_count,
            "last_query": self.last_query,
            "last_updated": self.last_updated
        })

    @gl.public.view
    def get_all_data(self) -> str:
        """Get all stored data in one call."""
        return json.dumps({
            "posts": json.loads(self.latest_posts),
            "sentiment": json.loads(self.latest_sentiment),
            "mindshare": json.loads(self.latest_mindshare),
            "stats": {
                "query_count": self.query_count,
                "last_query": self.last_query
            }
        })
