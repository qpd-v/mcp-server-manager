"use strict";var A=Object.create;var f=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var F=(c,r)=>{for(var a in r)f(c,a,{get:r[a],enumerable:!0})},P=(c,r,a,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of x(r))!D.call(c,t)&&t!==a&&f(c,t,{get:()=>r[t],enumerable:!(o=I(r,t))||o.enumerable});return c};var w=(c,r,a)=>(a=c!=null?A(T(c)):{},P(r||!c||!c.__esModule?f(a,"default",{value:c,enumerable:!0}):a,c)),E=c=>P(f({},"__esModule",{value:!0}),c);var _={};F(_,{activate:()=>O,deactivate:()=>L});module.exports=E(_);var s=w(require("vscode"));var i=w(require("vscode")),v=w(require("path")),g=w(require("fs/promises")),k=require("os"),b=class extends i.TreeItem{constructor(a,o,t){super(a,o);this.label=a;this.collapsibleState=o;this.configPath=t;this.tooltip=t,this.description=v.dirname(t),this.contextValue="configFile"}},C=class extends i.TreeItem{constructor(a,o,t){super(a,i.TreeItemCollapsibleState.None);this.label=a;this.configPath=o;this.config=t;this.tooltip=`${a}
Command: ${t.command} ${t.args?.join(" ")||""}`,this.description=t.disabled?"Disabled":"Enabled",this.contextValue=t.disabled?"server-disabled":"server-enabled",this.iconPath=new i.ThemeIcon(t.disabled?"circle-slash":"pass-filled",t.disabled?new i.ThemeColor("errorForeground"):new i.ThemeColor("testing.iconPassed"))}},y=class{_onDidChangeTreeData=new i.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;knownConfigPaths=new Set;constructor(){let r=(0,k.homedir)(),a=process.env.APPDATA||v.join(r,"AppData/Roaming");[v.join(a,"Claude/claude_desktop_config.json"),v.join(a,"Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json")].forEach(o=>this.addKnownConfigPath(o))}refresh(){this._onDidChangeTreeData.fire()}addKnownConfigPath(r){this.knownConfigPaths.add(r),this.refresh()}getTreeItem(r){return r}async getChildren(r){if(!r){let a=[];for(let o of this.knownConfigPaths)try{await g.access(o);let t=v.basename(v.dirname(o));a.push(new b(t,i.TreeItemCollapsibleState.Expanded,o))}catch{}return a}if(r instanceof b)try{let a=await g.readFile(r.configPath,"utf-8"),o=JSON.parse(a);return Object.entries(o.mcpServers).map(([t,p])=>new C(t,r.configPath,p))}catch{return[]}return[]}async addConfigFile(){let r={canSelectMany:!1,openLabel:"Select Config File",filters:{"JSON files":["json"]}},a=await i.window.showOpenDialog(r);if(a&&a[0]){let o=a[0].fsPath;try{let t=await g.readFile(o,"utf-8"),p=JSON.parse(t);if(!p.mcpServers||typeof p.mcpServers!="object")if(await i.window.showWarningMessage("This file does not appear to be an MCP config file. Would you like to initialize it as one?","Yes","No")==="Yes")p.mcpServers={},await g.writeFile(o,JSON.stringify(p,null,2));else return;this.addKnownConfigPath(o),i.window.showInformationMessage(`Added config file: ${o}`)}catch(t){i.window.showErrorMessage(`Failed to add config file: ${t}`)}}}async addServerToConfigs(r,a,o){for(let t of o)try{let p=await g.readFile(t,"utf-8"),m=JSON.parse(p);m.mcpServers=m.mcpServers||{},m.mcpServers[r]=a,await g.writeFile(t,JSON.stringify(m,null,2)),this.addKnownConfigPath(t)}catch(p){i.window.showErrorMessage(`Failed to add server to ${t}: ${p}`)}this.refresh()}async editServer(r){try{let a=await g.readFile(r.configPath,"utf-8"),o=JSON.parse(a),t=await i.workspace.openTextDocument({content:JSON.stringify(o.mcpServers[r.label],null,2),language:"json"}),p=await i.window.showTextDocument(t),m=i.workspace.onDidSaveTextDocument(async h=>{if(h===t){try{let d=JSON.parse(h.getText());o.mcpServers[r.label]=d,await g.writeFile(r.configPath,JSON.stringify(o,null,2)),this.refresh(),i.window.showInformationMessage(`Server ${r.label} configuration updated.`)}catch(d){i.window.showErrorMessage(`Failed to update server configuration: ${d}`)}m.dispose()}})}catch(a){i.window.showErrorMessage(`Failed to edit server configuration: ${a}`)}}async toggleServer(r,a){try{let o=await g.readFile(r.configPath,"utf-8"),t=JSON.parse(o);t.mcpServers[r.label].disabled=!a,await g.writeFile(r.configPath,JSON.stringify(t,null,2)),this.refresh(),i.window.showInformationMessage(`Server ${r.label} ${a?"enabled":"disabled"}.`)}catch(o){i.window.showErrorMessage(`Failed to ${a?"enable":"disable"} server: ${o}`)}}async removeServer(r){if(await i.window.showWarningMessage(`Are you sure you want to remove ${r.label}?`,"Yes","No")==="Yes")try{let o=await g.readFile(r.configPath,"utf-8"),t=JSON.parse(o);delete t.mcpServers[r.label],await g.writeFile(r.configPath,JSON.stringify(t,null,2)),this.refresh(),i.window.showInformationMessage(`Server ${r.label} removed.`)}catch(o){i.window.showErrorMessage(`Failed to remove server: ${o}`)}}};function e(c,r,a){return{name:c,description:r,category:a,installCommand:`npm install -g ${c}`,configTemplate:{command:"npx",args:["-y",c]}}}var S=[{id:"browser",name:"Browser",icon:"\u{1F4C2}",description:"Web content access and automation capabilities. Enables searching, scraping, and processing web content in AI-friendly formats.",servers:[e("@automatalabs/mcp-server-playwright","An MCP server for browser automation using Playwright","browser"),e("@browserbase/mcp-server-browserbase","Browser automation and web interaction","browser"),e("@browserbasehq/mcp-stagehand","Cloud browser automation capabilities using Stagehand","browser"),e("@executeautomation/playwright-mcp-server","An MCP server using Playwright for browser automation and webscraping","browser"),e("@it-beard/exa-server","Intelligent code search using Exa API","browser"),e("@kimtaeyoon83/mcp-server-youtube-transcript","Fetch YouTube subtitles and transcripts for AI analysis","browser"),e("@kimtth/mcp-aoai-web-browsing","Azure OpenAI and web browsing integration","browser"),e("@modelcontextprotocol/server-puppeteer","Browser automation for web scraping and interaction","browser"),e("@recursechat/mcp-server-apple-shortcuts","An MCP Server Integration with Apple Shortcuts","browser")]},{id:"cloud",name:"Cloud",icon:"\u2601\uFE0F",description:"Cloud platform service integration. Enables management and interaction with cloud infrastructure and services.",servers:[e("@aws/kb-retrieval-mcp","Retrieval from AWS Knowledge Base using Bedrock Agent Runtime","cloud"),e("@cloudflare/mcp-server-cloudflare","Integration with Cloudflare services including Workers, KV, R2, and D1","cloud"),e("@flux159/mcp-server-kubernetes","Typescript implementation of Kubernetes cluster operations for pods, deployments, services","cloud"),e("@rishikavikondala/mcp-server-aws","Perform operations on your AWS resources using an LLM","cloud"),e("@SmallCloudCo/smallcloud-mcp-server","Cloud service integration demonstration","cloud"),e("@strowk/mcp-k8s-go","Kubernetes cluster operations through MCP","cloud")]},{id:"command_line",name:"Command Line",icon:"\u{1F5A5}\uFE0F",description:"Run commands, capture output and otherwise interact with shells and command line tools.",servers:[e("@g0t4/mcp-server-commands","Run any command with run_command and run_script tools","command_line"),e("@mladensu/cli-mcp-server","Command line interface with secure execution and customizable security policies","command_line"),e("@PhialsBasement/CMD-MCP-Server","Secure command execution with analytics","command_line"),e("@simonb97/win-cli-mcp-server","MCP server for secure command-line interactions on Windows systems","command_line"),e("@tumf/mcp-shell-server","A secure shell command execution server implementing the Model Context Protocol","command_line")]},{id:"communication",name:"Communication",icon:"\u{1F4AC}",description:"Integration with communication platforms for message management and channel operations. Enables AI models to interact with team communication tools.",servers:[e("@enescinr/twitter-mcp","Interact with Twitter API, post and search tweets","communication"),e("@hannesrudolph/imessage-query-fastmcp","iMessage database access and search","communication"),e("@keturiosakys/bluesky-context-server","Another Bluesky integration with feed and post search capabilities","communication"),e("@markelaugust74/mcp-google-calendar","Google Calendar event management","communication"),e("@markuspfundstein/mcp-gsuite","Integration with Gmail and Google Calendar","communication"),e("@modelcontextprotocol/server-bluesky","Bluesky instance integration for querying and interaction","communication"),e("@modelcontextprotocol/server-slack","Slack workspace integration for channel management and messaging","communication"),e("@vidhupv/x-mcp","Create, manage and publish X/Twitter posts","communication")]},{id:"customer_data",name:"Customer Data",icon:"\u{1F464}",description:"Provides access to customer profiles inside of customer data platforms",servers:[e("@ivo-toby/contentful-mcp","Read, update, delete, publish content in Contentful spaces","customer_data"),e("@opendatamcp/opendatamcp","Connect any Open Data to any LLM with Model Context Protocol","customer_data"),e("@sergehuber/inoyu-mcp-unomi-server","An MCP server to access and update profiles on an Apache Unomi CDP server","customer_data"),e("@tinybirdco/mcp-tinybird","An MCP server to interact with a Tinybird Workspace from any MCP client","customer_data")]},{id:"database",name:"Database",icon:"\u{1F5C4}\uFE0F",description:"Secure database access with schema inspection capabilities. Enables querying and analyzing data with configurable security controls including read-only access.",servers:[e("@aekanun2020/mcp-server","MSSQL database integration with configurable access controls","database"),e("@benborla/mcp-server-mysql","MySQL database integration in NodeJS with configurable access controls","database"),e("@cyanheads/atlas-mcp-server","Atlas database integration","database"),e("@designcomputer/mysql_mcp_server","MySQL database integration with configurable access controls","database"),e("@ergut/mcp-bigquery-server","Server implementation for Google BigQuery integration","database"),e("@isaacwasserman/mcp-snowflake-server","Interact with Snowflake databases","database"),e("@joshuarileydev/supabase-mcp-server","Supabase MCP Server for managing projects and organisations","database"),e("@kashiwabyte/vikingdb-mcp-server","VikingDB integration with vector store capabilities","database"),e("@kiliczsh/mcp-mongo-server","MongoDB integration server","database"),e("@ktanaka101/mcp-server-duckdb","DuckDB database integration with schema inspection","database"),e("@lucashild/mcp-server-bigquery","BigQuery database integration with schema inspection and query capabilities","database"),e("@modelcontextprotocol/server-postgres","PostgreSQL database integration with schema inspection and query capabilities","database"),e("@modelcontextprotocol/server-sqlite","SQLite database operations with built-in analysis features","database"),e("@neo4j-contrib/mcp-neo4j","Neo4j graph database integration","database"),e("@quantgeekdev/mongo-mcp","MongoDB integration for LLM interaction","database"),e("@qdrant/mcp-server-qdrant","Qdrant vector database integration","database"),e("@surrealdb/surrealist-mcp","SurrealDB database integration","database"),e("@tinybirdco/mcp-tinybird","Tinybird integration with query and API capabilities","database")]},{id:"developer",name:"Developer Tools",icon:"\u{1F6E0}\uFE0F",description:"Tools and integrations that enhance the development workflow and environment management.",servers:[e("@Alec2435/python_mcp","Run Python code locally","developer"),e("@dabouelhassan/mcp-server-example-v2","FastAPI-based MCP server example","developer"),e("@e2b-dev/mcp-server","Code execution with E2B","developer"),e("@emiryasar/mcp_code_analyzer","Comprehensive code analysis tools","developer"),e("@ggoodman/mcp","CLI tool and UI for managing MCP servers","developer"),e("@jetbrains/mcpproxy","Connect to JetBrains IDE","developer"),e("@joshuarileydev/ios-simulator-controller","Control iOS simulators programmatically","developer"),e("@joshrutkowski/applescript-mcp","macOS AppleScript integration","developer"),e("@justjoehere/mcp_gradio_client","Gradio integration for MCP clients","developer"),e("@mcp-get/server-curl","Make HTTP requests using a curl-like interface","developer"),e("@mcp-get/server-llm-txt","Search and retrieve content from LLM.txt files","developer"),e("@mcp-get/server-macos","macOS-specific system information and operations","developer"),e("@mkearl/dependency-mcp","Analyze codebases to generate dependency graphs","developer"),e("@nguyenvanduocit/all-in-one-devtools","Collection of development tools","developer"),e("@oatpp/oatpp-mcp","C++ MCP integration for Oat++","developer"),e("@quantgeekdev/docker-mcp","Docker container management and operations","developer"),e("@rmrf2020/decision-mind","Decision making demo with client-server communication","developer"),e("@seanivore/mcp-code-analyzer","Python code analysis specialist","developer"),e("@shanejonas/openrpc-mpc-server","Interact with and discover JSON-RPC APIs via OpenRPC","developer"),e("@snaggle-ai/openapi-mcp-server","Connect any HTTP/REST API server using OpenAPI spec (v3)","developer"),e("@szeider/mcp-solver","MiniZinc constraint solving capabilities","developer"),e("@tumf/mcp-text-editor","Text editor integration","developer"),e("@vijayk-213/model-context-protocol","LLaMA model integration for summarization","developer"),e("@zeparhyfar/mcp-datetime","Advanced datetime handling and formatting","developer")]},{id:"finance",name:"Finance",icon:"\u{1F4B0}",description:"Financial data access and cryptocurrency market information. Enables querying real-time market data, crypto prices, and financial analytics.",servers:[e("@9nate-drake/mcp-yfinance","Yahoo Finance data integration","finance"),e("@Alec2435/amazon-fresh-server","Amazon Fresh integration and ordering","finance"),e("@anjor/coinmarket-mcp-server","Coinmarket API integration for crypto data","finance"),e("@calvernaz/alphavantage","Stock market data API integration with AlphaVantage","finance"),e("@quantgeekdev/coincap-mcp","Real-time cryptocurrency market data via CoinCap API","finance"),e("@sammcj/bybit-mcp","Bybit cryptocurrency exchange API access","finance")]},{id:"knowledge",name:"Knowledge",icon:"\u{1F9E0}",description:"Persistent memory storage using knowledge graph structures. Enables AI models to maintain and query structured information across sessions.",servers:[e("@chemiguel23/memorymesh","Enhanced graph-based memory for AI role-play","knowledge"),e("@modelcontextprotocol/server-memory","Knowledge graph-based persistent memory system","knowledge"),e("@run-llama/mcp-server-llamacloud","Integrate with data stored in LlamaCloud","knowledge"),e("@shaneholloman/mcp-knowledge-graph","Local knowledge graph for persistent memory","knowledge"),e("@Synaptic-Labs-AI/claudesidian","Second brain integration system","knowledge"),e("@topoteretes/cognee-mcp-server","GraphRAG memory server with customizable ingestion","knowledge")]},{id:"location",name:"Location",icon:"\u{1F5FA}\uFE0F",description:"Geographic and location-based services integration. Enables access to mapping data, directions, and place information.",servers:[e("@modelcontextprotocol/server-google-maps","Google Maps integration for location services","location"),e("@mstfe/google-task-mcp","Google Tasks integration and management","location")]},{id:"monitoring",name:"Monitoring",icon:"\u{1F4CA}",description:"Access and analyze application monitoring data. Enables AI models to review error reports and performance metrics.",servers:[e("@macrat/mcp-ayd-server","Ayd status monitoring service","monitoring"),e("@metoro-io/metoro-mcp-server","Query Kubernetes environments monitored by Metoro","monitoring"),e("@modelcontextprotocol/server-raygun","Raygun API V3 integration for monitoring","monitoring"),e("@modelcontextprotocol/server-sentry","Sentry.io integration for error tracking","monitoring"),e("@ruchernchong/mcp-server-google-analytics","Google Analytics data analysis","monitoring"),e("@Sladey01/mcp-snyk","Snyk security scanning integration","monitoring"),e("@sunsetcoder/flightradar24-mcp-server","Track flights using Flightradar24 data","monitoring"),e("@tevonsb/homeassistant-mcp","Control and monitor Home Assistant devices","monitoring")]},{id:"search",name:"Search",icon:"\u{1F50E}",description:"Web search and content discovery capabilities.",servers:[e("@ac3xx/mcp-servers-kagi","Kagi search API integration","search"),e("@ahonn/mcp-server-gsc","Access to Google Search Console data","search"),e("@andybrandt/mcp-simple-arxiv","Search and read papers from arXiv","search"),e("@andybrandt/mcp-simple-pubmed","Search medical papers from PubMed","search"),e("@angheljf/nyt","Search articles using the NYTimes API","search"),e("@apify/mcp-server-rag-web-browser","Web search and content scraping","search"),e("@blazickjp/arxiv-mcp-server","Search ArXiv research papers","search"),e("@dmayboroda/minima","Local RAG implementation","search"),e("@exa-labs/exa-mcp-server","Exa AI Search API integration","search"),e("@fatwang2/search1api-mcp","Search via search1api","search"),e("@it-beard/tavily-server","AI-powered search using Tavily API","search"),e("@laksh-star/mcp-server-tmdb","Movie and TV show data from TMDB","search"),e("@modelcontextprotocol/server-brave-search","Web search using Brave's Search API","search"),e("@modelcontextprotocol/server-fetch","Web content fetching and processing","search"),e("@mzxrai/mcp-webresearch","Search Google and do deep web research","search"),e("@secretiveshell/searxng-search","SearXNG metasearch engine integration","search"),e("@tomatio13/mcp-server-tavily","Tavily AI search API","search"),e("@vrknetha/mcp-server-firecrawl","Advanced web scraping with JS rendering","search"),e("@wong2/mcp-jina-reader","Fetch remote URLs as Markdown with Jina Reader","search")]},{id:"security",name:"Security",icon:"\u{1F510}",description:"Security scanning, analysis, and monitoring tools.",servers:[e("@axiomhq/mcp-server-axiom","Axiom observability platform integration","security"),e("@burtthecoder/maigret","OSINT username search tool integration","security"),e("@burtthecoder/shodan","Shodan security search engine integration","security"),e("@burtthecoder/virustotal","VirusTotal malware analysis integration","security")]},{id:"compliance",name:"Compliance",icon:"\u{1F512}",description:"Security policy implementation and compliance monitoring.",servers:[e("@dynamicendpoints/bod-25-01-cisa-mcp","CISA BOD 25-01 security requirements for Microsoft 365","compliance")]},{id:"travel",name:"Travel",icon:"\u{1F686}",description:"Access to travel and transportation information. Enables querying schedules, routes, and real-time travel data.",servers:[e("@r-huijts/ns-mcp-server","Access Dutch Railways (NS) travel information","travel")]},{id:"version_control",name:"Version Control",icon:"\u{1F504}",description:"Interact with Git repositories and version control platforms.",servers:[e("@block/goose-mcp","GitHub operations automation","version_control"),e("@modelcontextprotocol/server-git","Direct Git repository operations","version_control"),e("@modelcontextprotocol/server-github","GitHub API integration","version_control"),e("@modelcontextprotocol/server-gitlab","GitLab platform integration","version_control")]},{id:"other",name:"Other",icon:"\u{1F6E0}\uFE0F",description:"Additional tools and integrations.",servers:[e("@aliargun/mcp-server-gemini","Google Gemini AI models integration","other"),e("@amidabuddha/unichat-mcp-server","Multi-provider LLM integration","other"),e("@anaisbetts/mcp-installer","MCP server installer","other"),e("@anaisbetts/mcp-youtube","YouTube subtitles","other"),e("@andybrandt/mcp-simple-openai-assistant","OpenAI assistants integration","other"),e("@andybrandt/mcp-simple-timeserver","Time checking service","other"),e("@baba786/phabricator-mcp-server","Phabricator API integration","other"),e("@bartolli/mcp-llm-bridge","OpenAI-compatible LLMs","other"),e("@calclavia/mcp-obsidian","Markdown notes","other"),e("@ccabanillas/notion-mcp","Notion API integration","other"),e("@chatmcp/mcp-server-chatsum","Chat analysis","other"),e("@danhilse/notion_mcp","Notion API todo list management","other"),e("@dgormly/mcp-financial-advisor","Financial advisory and bookkeeping tools","other"),e("@DMontgomery40/mcp-canvas-lms","Canvas LMS course management","other"),e("@domdomegg/airtable-mcp-server","Airtable integration","other"),e("@evalstate/mcp-miro","MIRO whiteboard integration","other"),e("@felores/airtable-mcp","Alternative Airtable integration","other"),e("@future-audiences/wikimedia-enterprise-mcp","Wikipedia lookup","other"),e("@isaacwasserman/mcp-vegalite-server","Data visualization","other"),e("@jerhadf/linear-mcp-server","Linear project management","other"),e("@jimpick/fireproof-todo-mcp","Fireproof todo list","other"),e("@joshuarileydev/app-store-connect","App Store Connect integration","other"),e("@lightconetech/mcp-gateway","SSE Server gateway","other"),e("@llmindset/mcp-hfspace","HuggingFace Spaces integration","other"),e("@markuspfundstein/mcp-obsidian","Obsidian REST API integration","other"),e("@MCP-Club/mcpm","Command-line MCP server manager","other"),e("@mikeskarl/mcp-prompt-templates","Standardized analysis prompt templates","other"),e("@modelcontextprotocol/server-everything","MCP protocol feature examples","other"),e("@mrjoshuak/godoc-mcp","Token-efficient Go documentation server","other"),e("@mzxrai/mcp-openai","Chat with OpenAI's models","other"),e("@navisbio/clinicaltrials-mcp","ClinicalTrials.gov analysis","other"),e("@patruff/claude-mcp-setup","Easy Windows setup for MCP servers","other"),e("@patruff/ollama-mcp-bridge","Ollama LLM integration bridge","other"),e("@pierrebrunelle/mcp-server-openai","Query OpenAI models from Claude","other"),e("@pyroprompts/any-chat-completions-mcp","OpenAI-compatible API integration","other"),e("@reeeeemo/ancestry-mcp","Read .ged files and genetic data","other"),e("@rusiaaman/wcgw","Autonomous shell execution (Mac)","other"),e("@sammcj/package-version","Package version management tools","other"),e("@sirmews/apple-notes-mcp","Read Apple Notes database (macOS)","other"),e("@sirmews/mcp-pinecone","Pinecone vector database","other"),e("@skydeckai/mcp-server-rememberizer","Knowledge retrieval","other"),e("@smithery-ai/mcp-obsidian","Enhanced Obsidian vault integration","other"),e("@sooperset/mcp-atlassian","Confluence workspace integration","other"),e("@suekou/mcp-notion-server","Notion API integration","other"),e("@tanigami/mcp-server-perplexity","Perplexity API integration","other"),e("@v-3/notion-server","Notion page management","other"),e("@varunneal/spotify-mcp","Spotify playback control","other"),e("@wong2/litemcp","TypeScript framework for building MCP servers","other"),e("@wong2/mcp-cli","MCP server testing tool","other"),e("@zueai/mcp-manager","MCP server management UI","other")]},{id:"data_science",name:"Data Science",icon:"\u{1F9EE}",description:"Integrations and tools designed to simplify data exploration, analysis and enhance data science workflows.",servers:[e("@reading-plus-ai/mcp-server-data-exploration","Autonomous data exploration on .csv-based datasets","data_science"),e("@vivekvells/mcp-pandoc","Document format conversion using Pandoc","data_science")]},{id:"frameworks",name:"Frameworks",icon:"\u26A1\uFE0F",description:"Development frameworks and SDKs for building MCP servers.",servers:[e("@firebase/genkit-mcp","Genkit integration","frameworks"),e("@jlowin/fastmcp","Python framework","frameworks"),e("@linux-china/mcp-rs-template","Rust template","frameworks"),e("@mark3labs/mcp-go","Golang SDK","frameworks"),e("@metoro-io/mcp-golang","Type-safe Golang framework","frameworks"),e("@modelcontextprotocol/server-langchain","LangChain integration","frameworks"),e("@quarkiverse/quarkus-mcp-server","Quarkus framework MCP integration","frameworks"),e("@quantgeekdev/mcp-framework","TypeScript framework","frameworks"),e("@strowk/foxy-contexts","Declarative Golang library","frameworks"),e("@wong2/litemcp","JavaScript/TypeScript framework","frameworks")]},{id:"clients",name:"Clients",icon:"\u{1F5A5}\uFE0F",description:"Client applications and integrations for using MCP servers.",servers:[e("@3choff/mcp-chatbot","CLI chatbot","clients"),e("@adhikasp/mcp-client-cli","Multi-model CLI client","clients"),e("@boilingdata/mcp-server-and-gw","HTTP SSE gateway","clients"),e("@continuedev/continue","VSCode extension","clients"),e("@firebase/genkit","Agent framework","clients"),e("@lightconetech/mcp-gateway","SSE Server gateway","clients"),e("@mark3labs/mcphost","CLI host application","clients"),e("@secretiveshell/mcp-bridge","OpenAI middleware proxy","clients"),e("@upsonic/gpt-computer-assistant","Dockerized client","clients"),e("@zed-industries/zed","Multiplayer code editor","clients")]}];function M(c){for(let r of S){let a=r.servers.find(o=>o.name===c);if(a)return a}}function O(c){let r=new y,a=s.window.createTreeView("mcpServersView",{treeDataProvider:r,showCollapseAll:!0});c.subscriptions.push(s.commands.registerCommand("mcp-guide.refreshServers",()=>{r.refresh()}),s.commands.registerCommand("mcp-guide.searchConfigs",async()=>{await r.addConfigFile()}),s.commands.registerCommand("mcp-guide.browseServers",async()=>{try{let n=s.extensions.getExtension("rooveterinaryinc.roo-cline");if(n){let l=await n.activate();if(l&&l.useMCPTool){let u=await l.useMCPTool("mcp-guide","list_servers",{category:"all"});s.window.showInformationMessage("Retrieved latest server list from MCP Guide")}}}catch(n){console.log("Using local server list:",n)}let o=S.map(n=>({label:`${n.icon} ${n.name}`,description:`${n.servers.length} servers`,category:n})),t=await s.window.showQuickPick(o,{placeHolder:"Select a server category"});if(!t)return;let p=t.category.servers.map(n=>({label:n.name,description:n.description,server:n})),m=await s.window.showQuickPick(p,{placeHolder:"Select a server to install"});if(!m)return;let h=await r.getChildren();if(!h||h.length===0){await s.window.showWarningMessage("No MCP config files found. Would you like to add one?","Yes","No")==="Yes"&&await r.addConfigFile();return}let d=s.window.createQuickPick();d.title="Select Config Files",d.placeholder="Select which config files to add the server to (use Space to select multiple)",d.canSelectMany=!0,d.items=h.map(n=>({label:n.label,description:n.configPath,picked:!1})),d.buttons=[{iconPath:new s.ThemeIcon("check-all"),tooltip:"Select All"}],d.onDidTriggerButton(n=>{d.selectedItems=d.items}),d.onDidAccept(async()=>{let n=d.selectedItems.map(l=>l.description).filter(l=>l!==void 0);if(d.hide(),n.length>0){let l=s.window.createTerminal("MCP Server Installation");l.show(),l.sendText(m.server.installCommand),m.server.configTemplate&&(await r.addServerToConfigs(m.server.name,{...m.server.configTemplate,disabled:!1,alwaysAllow:[]},n),s.window.showInformationMessage(`Server ${m.server.name} installed and added to ${n.length} config file(s).`))}}),d.show()}),s.commands.registerCommand("mcp-guide.addServer",async()=>{let o=await s.window.showInputBox({prompt:"Enter the server name (e.g., @modelcontextprotocol/server-filesystem)",placeHolder:"Server name"});if(!o)return;if(M(o)&&await s.window.showInformationMessage(`Found configuration template for ${o}. Would you like to use it?`,"Yes","No")==="Yes"){s.commands.executeCommand("mcp-guide.browseServers");return}let p=await s.window.showInputBox({prompt:"Enter the command to run the server",placeHolder:"npx",value:"npx"});if(!p)return;let m=await s.window.showInputBox({prompt:"Enter command arguments (comma-separated)",placeHolder:"-y,@modelcontextprotocol/server-filesystem"}),h={command:p,args:m?m.split(",").map(l=>l.trim()):[],disabled:!1,alwaysAllow:[]},d=await r.getChildren();if(!d||d.length===0){s.window.showErrorMessage("No MCP config files found. Please add a config file first.");return}let n=s.window.createQuickPick();n.title="Select Config Files",n.placeholder="Select which config files to add the server to (use Space to select multiple)",n.canSelectMany=!0,n.items=d.map(l=>({label:l.label,description:l.configPath,picked:!1})),n.buttons=[{iconPath:new s.ThemeIcon("check-all"),tooltip:"Select All"}],n.onDidTriggerButton(l=>{n.selectedItems=n.items}),n.onDidAccept(async()=>{let l=n.selectedItems.map(u=>u.description).filter(u=>u!==void 0);n.hide(),l.length>0&&(await r.addServerToConfigs(o,h,l),s.window.showInformationMessage(`Server ${o} added to ${l.length} config file(s).`))}),n.show()}),s.commands.registerCommand("mcp-guide.editServer",o=>{r.editServer(o)}),s.commands.registerCommand("mcp-guide.enableServer",o=>{r.toggleServer(o,!0)}),s.commands.registerCommand("mcp-guide.disableServer",o=>{r.toggleServer(o,!1)}),s.commands.registerCommand("mcp-guide.removeServer",o=>{r.removeServer(o)}))}function L(){}0&&(module.exports={activate,deactivate});
