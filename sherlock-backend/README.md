


<p align="center">
  <a href="">Shai Cloud</a> ·
  <a href="">Self-hosting</a> ·
  <a href="">Documentation</a> ·
  <a href="">Enterprise inquiry</a>
</p>





Shai is an open-source LLM app development platform. Its intuitive interface combines agentic AI workflow, RAG pipeline, agent capabilities, model management, observability features and more, letting you quickly go from prototype to production.

## Quick start

> Before installing Shai, make sure your machine meets the following minimum system requirements:
>
> - CPU >= 2 Core
> - RAM >= 4 GiB

</br>

The easiest way to start the Shai server is through [docker compose](docker/docker-compose.yaml). Before running Shai with the following commands, make sure that [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed on your machine:

```bash
cd shai
cd docker
cp .env.example .env
docker compose up -d
```

After running, you can access the Shai dashboard in your browser at [http://localhost/install](http://localhost/install) and start the initialization process.



## Key features

**1. Workflow**:
Build and test powerful AI workflows on a visual canvas, leveraging all the following features and beyond.


**2. Comprehensive model support**:
Seamless integration with hundreds of proprietary / open-source LLMs from dozens of inference providers and self-hosted solutions, covering GPT, Mistral, Llama3, and any OpenAI API-compatible models. A full list of supported model providers can be found [here](https://docs.dify.ai/getting-started/readme/model-providers).

![providers-v5](https://github.com/langgenius/dify/assets/13230914/5a17bdbe-097a-4100-8363-40255b70f6e3)

**3. Prompt IDE**:
Intuitive interface for crafting prompts, comparing model performance, and adding additional features such as text-to-speech to a chat-based app.

**4. RAG Pipeline**:
Extensive RAG capabilities that cover everything from document ingestion to retrieval, with out-of-box support for text extraction from PDFs, PPTs, and other common document formats.

**5. Agent capabilities**:
You can define agents based on LLM Function Calling or ReAct, and add pre-built or custom tools for the agent. Shai provides 50+ built-in tools for AI agents, such as Google Search, DALL·E, Stable Diffusion and WolframAlpha.

**6. LLMOps**:
Monitor and analyze application logs and performance over time. You could continuously improve prompts, datasets, and models based on production data and annotations.

**7. Backend-as-a-Service**:
All of Shai's offerings come with corresponding APIs, so you could effortlessly integrate Shai into your own business logic.

## Feature Comparison

<table style="width: 100%;">
  <tr>
    <th align="center">Feature</th>
    <th align="center">Shai.AI</th>
    <th align="center">LangChain</th>
    <th align="center">Flowise</th>
    <th align="center">OpenAI Assistants API</th>
  </tr>
  <tr>
    <td align="center">Programming Approach</td>
    <td align="center">API + App-oriented</td>
    <td align="center">Python Code</td>
    <td align="center">App-oriented</td>
    <td align="center">API-oriented</td>
  </tr>
  <tr>
    <td align="center">Supported LLMs</td>
    <td align="center">Rich Variety</td>
    <td align="center">Rich Variety</td>
    <td align="center">Rich Variety</td>
    <td align="center">OpenAI-only</td>
  </tr>
  <tr>
    <td align="center">RAG Engine</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
  </tr>
  <tr>
    <td align="center">Agent</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
    <td align="center">✅</td>
  </tr>
  <tr>
    <td align="center">Workflow</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
  </tr>
  <tr>
    <td align="center">Observability</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
    <td align="center">❌</td>
  </tr>
  <tr>
    <td align="center">Enterprise Feature (SSO/Access control)</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
    <td align="center">❌</td>
    <td align="center">❌</td>
  </tr>
  <tr>
    <td align="center">Local Deployment</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">❌</td>
  </tr>
</table>

## Using Shai

- **Cloud </br>**
  We host a [Shai Cloud](https://dify.ai) service for anyone to try with zero setup. It provides all the capabilities of the self-deployed version, and includes 200 free GPT-4 calls in the sandbox plan.

- **Self-hosting Shai Community Edition</br>**
  Quickly get Shai running in your environment with this [starter guide](#quick-start).
  Use our [documentation](https://docs.dify.ai) for further references and more in-depth instructions.

- **Shai for enterprise / organizations</br>**
  We provide additional enterprise-centric features. [Log your questions for us through this chatbot](https://udify.app/chat/22L1zSxg6yW1cWQg) or [send us an email](mailto:business@dify.ai?subject=[GitHub]Business%20License%20Inquiry) to discuss enterprise needs. </br>
  > For startups and small businesses using AWS, check out [Shai Premium on AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-t22mebxzwjhu6) and deploy it to your own AWS VPC with one-click. It's an affordable AMI offering with the option to create apps with custom logo and branding.



## Advanced Setup

If you need to customize the configuration, please refer to the comments in our [.env.example](docker/.env.example) file and update the corresponding values in your `.env` file. Additionally, you might need to make adjustments to the `docker-compose.yaml` file itself, such as changing image versions, port mappings, or volume mounts, based on your specific deployment environment and requirements. After making any changes, please re-run `docker-compose up -d`. You can find the full list of available environment variables [here](https://docs.dify.ai/getting-started/install-self-hosted/environments).

If you'd like to configure a highly-available setup, there are community-contributed [Helm Charts](https://helm.sh/) and YAML files which allow Shai to be deployed on Kubernetes.




