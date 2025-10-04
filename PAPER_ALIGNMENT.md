# CureFun Paper Alignment

This document outlines how our VSP implementation aligns with the CureFun paper:
**"Leveraging Large Language Model as Simulated Patients for Clinical Education"**
(Li et al., 2024, arXiv:2404.13066v2)

## Key Methodologies Implemented

### 1. Graph-Driven Context-Adaptive SP Chatbot (ERRG Process)

The paper proposes an Extract-Retrieve-Rewrite-Generate (ERRG) mechanism:

- **Extract**: Extract core entities and relations from user input
- **Retrieve**: Query case graph for relevant information
- **Rewrite**: Transform retrieved data into natural language
- **Generate**: Create contextually appropriate responses

**Our Implementation**:

- LangChain's ConversationBufferMemory maintains dialogue context
- Case data structured as JSON with entities and relationships
- Prompt engineering guides the LLM to stay in character and provide consistent responses

### 2. Structured Case Representation

Paper uses NER and relation extraction to build case graphs with:

- Medical entities (symptoms, diseases, medications)
- Relationships between entities
- Attributes and values (temperature, blood pressure)

**Our Implementation**:

- JSON-based case files with structured fields
- Comprehensive symptom descriptions
- Medical history with relationships (family history, medications)
- Background context for realistic portrayal

### 3. Two-Tier Assessment System

The paper's evaluation uses:

- **Aspects (30% weight)**: Items requiring proactive inquiry
- **Information (70% weight)**: Key information to be elicited

**Our Implementation**:

- 8 psychiatric interviewing criteria (mental health adapted)
- Each criterion scored 0-10
- Detailed evaluation with strengths and improvement areas
- LLM-based assessment using GPT-4 as evaluator

### 4. Non-Scoring Metrics

Paper tracks:

- Information Density: Entity and medical entity density
- Emotional Tendency: Emotional polarity of conversation
- Response Length: Average response length
- Turn Number: Total conversation turns

**Our Implementation**:

- Session storage tracks full conversation history
- Message counting available for analysis
- Can be extended to include sentiment analysis and entity extraction

### 5. Model-Agnostic Framework

Paper emphasizes compatibility with multiple LLMs.

**Our Implementation**:

- Backend uses configurable OpenAI API (supports GPT-4, GPT-3.5-turbo)
- Can be adapted to use other LLM providers
- Prompt templates separate from core logic

## Mental Health Adaptation

While the CureFun paper focuses on physical medicine (COPD, diabetes, pneumonia), we adapted the framework for **mental health education**:

### Case Domains

- **Paper**: Physical medicine cases (gastric disorders, diabetes, COPD, COVID, pneumonia, bronchiectasis)
- **Our System**: Mental health cases (Depression, Anxiety, PTSD, Bipolar Disorder)

### Evaluation Criteria Adaptation

- **Paper**: Medical history taking, physical examination, diagnostic reasoning
- **Our System**: Psychiatric interviewing skills, risk assessment, therapeutic alliance, cultural sensitivity

### Interview Focus

- **Paper**: Symptom characterization, onset/duration, associated symptoms, risk factors
- **Our System**: Rapport building, active listening, risk assessment (suicide/homicide), biopsychosocial assessment

## Key Findings from Paper Applied to Our System

### 1. LLM Performance Enhancement

Paper showed framework improved B-ELO scores:

- GPT-3.5-Turbo: +250.18 points with framework
- ERNIE-Bot 4: +99.27 points

**Applied**: Our prompt engineering and structured memory help maintain patient role consistency

### 2. Role Flipping Prevention

Paper noted LLMs (especially GPT-3.5) tend to flip from patient to doctor role.

**Applied**: Our patient prompt explicitly instructs:

- "Stay in character throughout the conversation"
- "You should ONLY describe your experiences, symptoms, and feelings - NOT provide diagnoses"
- Continuous context reminders through conversation history

### 3. Assessment Reliability

Paper achieved high correlation with human evaluators:

- Spearman's rank: average 0.81
- Pearson's: average 0.85

**Applied**: Our LLM-based evaluation uses structured criteria and detailed prompts for consistent assessment

### 4. Hallucination Prevention

Paper addresses fictional information generation through controlled mechanisms.

**Applied**:

- Comprehensive case files prevent information gaps
- Prompts instruct patient to say "I don't have/experience that" when asked about absent symptoms
- Case data includes explicit "medical_history" to prevent conflicting information

## Future Enhancements to Further Align with Paper

### 1. Implement Full ERRG Pipeline

- Add NER model for entity extraction from student queries
- Build knowledge graph from case JSON
- Implement SPARQL-like queries for information retrieval
- Add controlled fictional information generation

### 2. Enhanced Assessment

- Implement vote-based ensemble (multiple LLM evaluators)
- Add explicit Aspect/Information scoring (30%/70% split)
- Include non-scoring metrics calculation
- Store historical assessment data

### 3. Graph Database Integration

- Migrate from JSON to graph database (Neo4j or similar)
- Implement RDF format for patient information
- Enable SPARQL queries for complex information retrieval

### 4. Multi-Modal Features

- Add TTS (Text-to-Speech) for patient responses
- Add STT (Speech-to-Text) for student input
- Enable voice-based interviews

### 5. Advanced Analytics

- Track information density per conversation
- Analyze emotional tendency using sentiment analysis
- Generate comparative metrics (student vs. expert baseline)
- Provide detailed conversation analytics

## References

Li, Y., Zeng, C., Zhong, J., Zhang, R., Zhang, M., & Zou, L. (2024).
Leveraging Large Language Model as Simulated Patients for Clinical Education.
arXiv preprint arXiv:2404.13066v2.
