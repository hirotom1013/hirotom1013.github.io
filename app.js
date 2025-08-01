// MindEase - Student Mental Health Support Application
// Main JavaScript functionality

class MindEaseApp {
    constructor() {
        this.currentSection = 'home';
        this.stressTestData = null;
        this.breathingInterval = null;
        this.breathingCycle = 0;
        this.sessionStart = null;
        this.currentBreathingTechnique = '4-7-8';
        this.quizzes = JSON.parse(localStorage.getItem('mindease-quizzes')) || [];
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.progressData = JSON.parse(localStorage.getItem('mindease-progress')) || this.initializeProgressData();
        this.personalityProfile = JSON.parse(localStorage.getItem('mindease-personality')) || null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupChatbot();
        this.setupStressTest();
        this.setupBreathingExercise();
        this.setupQuizMaker();
        this.setupStudyCoach();
        this.setupProgressTracking();
        this.loadStressTestQuestions();
        this.loadQuizLibrary();
    }

    // Navigation System
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const featureCards = document.querySelectorAll('.feature-card');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    navigateToSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
    }

    // AI Chatbot Feature
    setupChatbot() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        const chatMessages = document.getElementById('chatMessages');

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            chatInput.value = '';

            // Simulate AI response
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Advanced sentiment analysis
        const sentiment = this.analyzeSentiment(message);
        const context = this.getConversationContext();
        
        // Comprehensive keyword patterns with emotional intelligence
        const keywordPatterns = {
            // Stress-related keywords
            stress: {
                keywords: ['stress', 'stressed', 'stressing', 'pressure', 'pressured'],
                responses: [
                    "I can sense you're feeling stressed right now. That's completely understandable - tests can create a lot of pressure. Remember, stress is your mind's way of showing you care about succeeding. Let's work through this together. Would you like to try a quick breathing exercise, or would you prefer to talk about what's specifically causing the most stress?",
                    "Stress before tests is incredibly common, and you're definitely not alone in feeling this way. Your body is responding to what feels like a challenge, which actually shows how much you care about doing well. Let's focus on managing this stress step by step. What feels most overwhelming right now?",
                    "I hear that you're experiencing stress, and I want you to know that's a normal response to upcoming tests. The good news is that we can work together to transform that stress into focused energy. Would you like some personalized stress management techniques, or shall we break down your concerns into smaller, manageable pieces?"
                ]
            },
            
            // Anxiety patterns
            anxiety: {
                keywords: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'scared', 'afraid', 'panic'],
                responses: [
                    "Anxiety can feel really intense, but you're showing incredible strength by reaching out. Test anxiety affects many students, and there are proven ways to manage it. Remember that anxiety often makes situations seem bigger than they actually are. Let's ground you in the present moment - can you tell me three things you can see around you right now?",
                    "I understand you're feeling anxious, and that takes courage to share. Anxiety before tests is your mind trying to protect you, but sometimes it goes into overdrive. You've handled difficult situations before, and you have the tools to handle this too. Would you like to explore some anxiety-reducing techniques, or would talking through your specific worries help more?",
                    "Anxiety can make everything feel uncertain, but let's focus on what you do know and what you can control. You're prepared, you're capable, and anxiety doesn't define your abilities. Let's work on some techniques to calm your nervous system. Would you prefer a guided breathing exercise or some positive visualization?"
                ]
            },
            
            // Overwhelm and burnout
            overwhelmed: {
                keywords: ['overwhelmed', 'too much', 'cant handle', 'drowning', 'exhausted', 'burnout', 'burn out'],
                responses: [
                    "Feeling overwhelmed is a clear signal that you're carrying a heavy load, and it's completely understandable. When everything feels like 'too much,' it often helps to step back and prioritize. You don't have to do everything perfectly - you just need to do your best with what you have. Let's break this down: what's the one most important thing you need to focus on today?",
                    "I can hear that you're feeling overwhelmed, and that's a very human response to academic pressure. Remember, being overwhelmed doesn't mean you can't handle this - it just means you need to approach things differently. Let's create a plan that feels manageable. What would make the biggest difference in reducing your stress right now?",
                    "Overwhelm is often our mind's way of saying we need to slow down and reorganize. You're dealing with a lot, and it's okay to feel this way. The good news is that overwhelm is temporary and manageable. Would you like help creating a priority list, or would you prefer to start with some calming techniques to clear your mind first?"
                ]
            },
            
            // Confidence and positive states
            confident: {
                keywords: ['confident', 'ready', 'prepared', 'good', 'great', 'positive', 'excited'],
                responses: [
                    "I love hearing that confidence in your voice! That positive energy is going to serve you so well. Confidence is built on preparation and self-belief, and it sounds like you have both. How are you planning to maintain this great mindset leading up to your test?",
                    "That's fantastic! Confidence is one of the best predictors of success, and you're clearly in a great mental space. This positive attitude will help you think more clearly and perform better. What strategies have been working best for building your confidence?",
                    "Your confidence is wonderful to hear! It shows that your preparation is paying off and you believe in your abilities. Remember this feeling - you can tap into it whenever you need a boost. What's been most helpful in building this confidence?"
                ]
            },
            
            // Fatigue and sleep issues
            tired: {
                keywords: ['tired', 'exhausted', 'sleepy', 'fatigue', 'sleep', 'insomnia', 'cant sleep'],
                responses: [
                    "Rest is absolutely crucial for both learning and test performance. When you're tired, everything feels harder than it actually is. Your brain consolidates memories during sleep, so adequate rest isn't just recovery - it's actually part of effective studying. What's been affecting your sleep most?",
                    "Feeling tired can make studying feel impossible and increase anxiety. It's important to remember that quality rest isn't time wasted - it's an investment in your performance. Have you been able to maintain a consistent sleep schedule, or has test stress been keeping you up?",
                    "Fatigue can be both physical and mental, especially during intense study periods. Sometimes the kindest thing you can do for yourself is to rest rather than push through exhaustion. Would you like some tips for better sleep hygiene, or are you looking for ways to study more effectively when you're feeling tired?"
                ]
            },
            
            // Study and preparation concerns
            studying: {
                keywords: ['study', 'studying', 'preparation', 'prepare', 'review', 'material', 'notes'],
                responses: [
                    "It sounds like you're focused on preparation, which is great! Effective studying is about quality, not just quantity. What study methods have been working best for you so far? I can suggest some evidence-based techniques that might help you feel even more prepared.",
                    "Preparation is key to feeling confident, and it's clear you're taking this seriously. Remember that effective studying includes breaks and self-care too. How are you balancing study time with rest and stress management?",
                    "Your dedication to studying shows how much you care about succeeding. Sometimes the most productive thing you can do is step back and assess whether your study methods are serving you well. Would you like some tips for more effective studying, or are you looking for help with motivation?"
                ]
            },
            
            // Time management issues
            time: {
                keywords: ['time', 'deadline', 'running out', 'late', 'behind', 'schedule', 'cramming'],
                responses: [
                    "Time pressure can definitely increase stress, but remember that you still have time to make a positive impact on your preparation. It's better to study strategically with limited time than to panic. Let's focus on the most high-yield study activities. What are the most important topics you need to review?",
                    "When time feels short, it's important to work smarter, not just harder. Panic about time often leads to inefficient studying. Let's create a realistic plan for the time you have left. What feels most urgent to address first?",
                    "Time constraints can feel overwhelming, but you can still make meaningful progress. Focus on reviewing key concepts rather than trying to learn everything perfectly. What study materials do you feel most confident about, and what needs the most attention?"
                ]
            },
            
            // Failure and performance fears
            failure: {
                keywords: ['fail', 'failure', 'failing', 'bad grade', 'not good enough', 'stupid', 'dumb'],
                responses: [
                    "I hear worry about performance in what you're sharing, and those fears are completely understandable. But please remember that your worth as a person is not determined by any test score. You are not your grades. You have value beyond academic performance, and one test doesn't define your intelligence or potential.",
                    "Fear of failure can actually interfere with performance by creating anxiety that gets in the way of clear thinking. You are capable and prepared. Instead of focusing on what might go wrong, let's focus on what you've already accomplished and what you can control right now.",
                    "Those self-critical thoughts aren't helping you right now. You wouldn't speak to a friend the way you might be speaking to yourself. You're working hard, you're trying your best, and that matters more than any grade. What would you tell a good friend who was feeling the same way?"
                ]
            }
        };
        
        // Check for complex patterns and context
        let selectedResponse = null;
        let matchedCategory = null;
        
        for (const [category, data] of Object.entries(keywordPatterns)) {
            for (const keyword of data.keywords) {
                if (message.includes(keyword)) {
                    selectedResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                    matchedCategory = category;
                    break;
                }
            }
            if (selectedResponse) break;
        }
        
        // If no specific pattern matched, provide contextual general responses
        if (!selectedResponse) {
            const generalResponses = [
                "Thank you for sharing that with me. I'm here to listen and support you through this challenging time. What's on your mind about your upcoming tests?",
                "I appreciate you opening up. Every student's experience is unique, and I want to understand what would be most helpful for you right now. What's your biggest concern?",
                "It takes courage to reach out when you're struggling. Remember that seeking support is a sign of strength, not weakness. How are you feeling about your test preparation overall?",
                "I'm here to support you in whatever way feels most helpful. Whether you need study strategies, stress management techniques, or just someone to listen, I'm here for you. What would feel most supportive right now?",
                "Your feelings and experiences are valid, whatever they are. Many students face similar challenges, and you're not alone in this. What aspect of test preparation feels most challenging right now?",
                "I believe in your ability to work through whatever you're facing. You've overcome challenges before, and you have the strength to handle this too. What strategies have helped you in difficult situations before?",
                "Remember that this test is just one moment in your educational journey. It doesn't define your worth or your potential. You've made it through 100% of your difficult days so far - that's an incredible track record!"
            ];
            
            selectedResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
        }
        
        // Add personalized elements based on conversation context
        if (context.previousTopics.length > 0) {
            const followUp = this.generateContextualFollowUp(matchedCategory, context);
            if (followUp) {
                selectedResponse += ` ${followUp}`;
            }
        }
        
        // Store conversation context
        this.updateConversationContext(matchedCategory, sentiment, userMessage);
        
        return selectedResponse;
    }
    
    analyzeSentiment(message) {
        const positiveWords = ['good', 'great', 'excellent', 'confident', 'ready', 'prepared', 'happy', 'excited', 'calm', 'relaxed'];
        const negativeWords = ['bad', 'terrible', 'awful', 'stressed', 'anxious', 'worried', 'overwhelmed', 'tired', 'scared', 'nervous'];
        const intensifiers = ['very', 'extremely', 'really', 'so', 'incredibly', 'totally'];
        
        let sentiment = 0;
        const words = message.toLowerCase().split(' ');
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const prevWord = i > 0 ? words[i-1] : null;
            const multiplier = intensifiers.includes(prevWord) ? 2 : 1;
            
            if (positiveWords.includes(word)) {
                sentiment += 1 * multiplier;
            } else if (negativeWords.includes(word)) {
                sentiment -= 1 * multiplier;
            }
        }
        
        return sentiment;
    }
    
    getConversationContext() {
        if (!this.conversationContext) {
            this.conversationContext = {
                previousTopics: [],
                dominantSentiment: 0,
                sessionStartTime: Date.now(),
                messageCount: 0
            };
        }
        return this.conversationContext;
    }
    
    updateConversationContext(category, sentiment, message) {
        const context = this.getConversationContext();
        context.messageCount++;
        context.dominantSentiment = (context.dominantSentiment + sentiment) / 2;
        
        if (category && !context.previousTopics.includes(category)) {
            context.previousTopics.push(category);
        }
        
        // Keep only last 5 topics for relevance
        if (context.previousTopics.length > 5) {
            context.previousTopics.shift();
        }
    }
    
    generateContextualFollowUp(currentCategory, context) {
        const followUps = {
            stress: [
                "I noticed we've talked about stress before. How are the techniques we discussed working for you?",
                "Since stress seems to be a recurring concern, would you like to explore some long-term stress management strategies?"
            ],
            anxiety: [
                "I remember you mentioned anxiety earlier. Have you tried any of the grounding techniques we discussed?",
                "Anxiety seems to be something you're working through. Would you like to explore what specifically triggers these feelings?"
            ],
            tired: [
                "Rest came up in our previous conversation too. How has your sleep been since we last talked?",
                "I notice fatigue is a pattern for you. Let's focus on some sustainable energy management strategies."
            ]
        };
        
        if (currentCategory && context.previousTopics.includes(currentCategory) && followUps[currentCategory]) {
            return followUps[currentCategory][Math.floor(Math.random() * followUps[currentCategory].length)];
        }
        
        return null;
    }

    // Stress Test Feature
    setupStressTest() {
        const retakeButton = document.getElementById('retakeTest');
        if (retakeButton) {
            retakeButton.addEventListener('click', () => {
                this.resetStressTest();
            });
        }
    }

    loadStressTestQuestions() {
        const questions = [
            {
                question: "How often have you felt nervous or stressed in the past week?",
                options: [
                    { text: "Never", value: 0 },
                    { text: "Rarely", value: 1 },
                    { text: "Sometimes", value: 2 },
                    { text: "Often", value: 3 },
                    { text: "Very often", value: 4 }
                ]
            },
            {
                question: "How difficult has it been to concentrate on your studies?",
                options: [
                    { text: "Not difficult at all", value: 0 },
                    { text: "Slightly difficult", value: 1 },
                    { text: "Moderately difficult", value: 2 },
                    { text: "Very difficult", value: 3 },
                    { text: "Extremely difficult", value: 4 }
                ]
            },
            {
                question: "How often do you worry about upcoming tests or assignments?",
                options: [
                    { text: "Never", value: 0 },
                    { text: "Rarely", value: 1 },
                    { text: "Sometimes", value: 2 },
                    { text: "Often", value: 3 },
                    { text: "Constantly", value: 4 }
                ]
            },
            {
                question: "How has your sleep been affected by academic stress?",
                options: [
                    { text: "Not affected at all", value: 0 },
                    { text: "Slightly affected", value: 1 },
                    { text: "Moderately affected", value: 2 },
                    { text: "Significantly affected", value: 3 },
                    { text: "Severely affected", value: 4 }
                ]
            },
            {
                question: "How confident do you feel about your academic performance?",
                options: [
                    { text: "Very confident", value: 0 },
                    { text: "Somewhat confident", value: 1 },
                    { text: "Neutral", value: 2 },
                    { text: "Not very confident", value: 3 },
                    { text: "Not confident at all", value: 4 }
                ]
            },
            {
                question: "How often do you experience physical symptoms of stress (headaches, muscle tension, etc.)?",
                options: [
                    { text: "Never", value: 0 },
                    { text: "Rarely", value: 1 },
                    { text: "Sometimes", value: 2 },
                    { text: "Often", value: 3 },
                    { text: "Very often", value: 4 }
                ]
            },
            {
                question: "How overwhelmed do you feel with your current workload?",
                options: [
                    { text: "Not overwhelmed", value: 0 },
                    { text: "Slightly overwhelmed", value: 1 },
                    { text: "Moderately overwhelmed", value: 2 },
                    { text: "Very overwhelmed", value: 3 },
                    { text: "Extremely overwhelmed", value: 4 }
                ]
            }
        ];

        this.renderStressTestQuestions(questions);
    }

    renderStressTestQuestions(questions) {
        const container = document.getElementById('stressQuestions');
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.innerHTML = `
                <h4>Question ${index + 1}: ${q.question}</h4>
                <div class="options">
                    ${q.options.map((option, optIndex) => `
                        <label class="option">
                            <input type="radio" name="question_${index}" value="${option.value}">
                            <span>${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            container.appendChild(questionDiv);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Calculate Stress Level';
        submitButton.className = 'btn-primary mt-2';
        submitButton.addEventListener('click', () => this.calculateStressLevel());
        container.appendChild(submitButton);
    }

    calculateStressLevel() {
        const formData = new FormData();
        const questions = document.querySelectorAll('[name^="question_"]');
        let totalScore = 0;
        let answeredQuestions = 0;

        questions.forEach(question => {
            if (question.checked) {
                totalScore += parseInt(question.value);
                answeredQuestions++;
            }
        });

        if (answeredQuestions < 7) {
            alert('Please answer all questions before calculating your stress level.');
            return;
        }

        const maxScore = 28; // 7 questions × 4 max points
        const percentage = (totalScore / maxScore) * 100;
        
        this.showStressResults(percentage, totalScore);
    }

    showStressResults(percentage, totalScore) {
        document.getElementById('stressQuestions').classList.add('hidden');
        const resultsContainer = document.getElementById('stressResults');
        resultsContainer.classList.remove('hidden');

        const meterFill = document.getElementById('stressMeterFill');
        setTimeout(() => {
            meterFill.style.width = `${percentage}%`;
        }, 500);

        const recommendations = document.getElementById('stressRecommendations');
        let level, advice, color;

        if (percentage <= 35) {
            level = "Low Stress Level";
            color = "#10b981";
            advice = "Great job managing your stress! Continue with your current coping strategies. Regular breathing exercises and maintaining a healthy study schedule will help you stay on track.";
        } else if (percentage <= 65) {
            level = "Moderate Stress Level";
            color = "#f59e0b";
            advice = "You're experiencing moderate stress, which is normal before tests. Try our breathing exercises, take regular breaks, and consider breaking your study material into smaller chunks. Don't hesitate to reach out for support.";
        } else {
            level = "High Stress Level";
            color = "#ef4444";
            advice = "You're experiencing high levels of stress. This is a signal to take immediate action. Try our breathing exercises, consider talking to a counselor, take regular breaks, and remember that your worth isn't defined by test scores. Please reach out for professional support if these feelings persist.";
        }

        meterFill.style.background = color;
        recommendations.innerHTML = `
            <h4 style="color: ${color}">${level}</h4>
            <p>${advice}</p>
            <div style="margin-top: 1rem;">
                <strong>Immediate suggestions:</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li>Try our guided breathing exercises</li>
                    <li>Take a 10-minute break from studying</li>
                    <li>Chat with our AI for emotional support</li>
                    <li>Practice with our quiz maker to build confidence</li>
                </ul>
            </div>
        `;
    }

    resetStressTest() {
        document.getElementById('stressResults').classList.add('hidden');
        document.getElementById('stressQuestions').classList.remove('hidden');
        document.querySelectorAll('[name^="question_"]').forEach(input => {
            input.checked = false;
        });
        document.getElementById('stressMeterFill').style.width = '0%';
    }

    // Breathing Exercise Feature
    setupBreathingExercise() {
        const techniqueButtons = document.querySelectorAll('.technique-btn');
        const startButton = document.getElementById('startBreathing');
        const pauseButton = document.getElementById('pauseBreathing');
        const stopButton = document.getElementById('stopBreathing');

        techniqueButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                techniqueButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentBreathingTechnique = btn.dataset.technique;
                this.stopBreathingExercise();
            });
        });

        startButton.addEventListener('click', () => this.startBreathingExercise());
        pauseButton.addEventListener('click', () => this.pauseBreathingExercise());
        stopButton.addEventListener('click', () => this.stopBreathingExercise());
    }

    startBreathingExercise() {
        if (!this.sessionStart) {
            this.sessionStart = Date.now();
        }

        document.getElementById('startBreathing').classList.add('hidden');
        document.getElementById('pauseBreathing').classList.remove('hidden');

        const techniques = {
            '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
            'box': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
            'calm': { inhale: 3, hold: 0, exhale: 6 }
        };

        const technique = techniques[this.currentBreathingTechnique];
        this.runBreathingCycle(technique);
    }

    runBreathingCycle(technique) {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        let phase = 0;
        const phases = [];

        // Build phases based on technique
        phases.push({ name: 'inhale', duration: technique.inhale, text: 'Breathe In' });
        if (technique.hold) phases.push({ name: 'hold', duration: technique.hold, text: 'Hold' });
        phases.push({ name: 'exhale', duration: technique.exhale, text: 'Breathe Out' });
        if (technique.pause) phases.push({ name: 'pause', duration: technique.pause, text: 'Pause' });

        const runPhase = () => {
            if (!this.breathingInterval) return;

            const currentPhase = phases[phase % phases.length];
            text.textContent = currentPhase.text;
            
            // Apply visual effects
            circle.className = 'breathing-circle';
            if (currentPhase.name === 'inhale') {
                circle.classList.add('inhale');
            } else if (currentPhase.name === 'exhale') {
                circle.classList.add('exhale');
            }

            setTimeout(() => {
                phase++;
                if (phase % phases.length === 0) {
                    this.breathingCycle++;
                    this.updateSessionInfo();
                }
                runPhase();
            }, currentPhase.duration * 1000);
        };

        this.breathingInterval = true;
        runPhase();
    }

    pauseBreathingExercise() {
        this.breathingInterval = null;
        document.getElementById('startBreathing').classList.remove('hidden');
        document.getElementById('pauseBreathing').classList.add('hidden');
        document.getElementById('breathingText').textContent = 'Paused - Click Start to Continue';
        document.getElementById('breathingCircle').className = 'breathing-circle';
    }

    stopBreathingExercise() {
        this.breathingInterval = null;
        this.breathingCycle = 0;
        this.sessionStart = null;
        
        document.getElementById('startBreathing').classList.remove('hidden');
        document.getElementById('pauseBreathing').classList.add('hidden');
        document.getElementById('breathingText').textContent = 'Click Start';
        document.getElementById('breathingCircle').className = 'breathing-circle';
        
        this.updateSessionInfo();
    }

    updateSessionInfo() {
        document.getElementById('sessionCount').textContent = this.breathingCycle;
        const duration = this.sessionStart ? Math.floor((Date.now() - this.sessionStart) / 1000) : 0;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        document.getElementById('sessionDuration').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Quiz Maker Feature
    setupQuizMaker() {
        this.setupQuizTabs();
        this.setupQuizCreation();
        this.setupQuizPractice();
    }

    setupQuizTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchQuizTab(tabName);
            });
        });
    }

    switchQuizTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}Tab`).classList.add('active');

        if (tabName === 'library' || tabName === 'practice') {
            this.loadQuizLibrary();
        }
    }

    setupQuizCreation() {
        const addQuestionBtn = document.getElementById('addQuestion');
        const saveQuizBtn = document.getElementById('saveQuiz');
        const clearQuizBtn = document.getElementById('clearQuiz');

        addQuestionBtn.addEventListener('click', () => this.addQuestion());
        saveQuizBtn.addEventListener('click', () => this.saveQuiz());
        clearQuizBtn.addEventListener('click', () => this.clearQuizForm());

        // Add first question by default
        this.addQuestion();
    }

    addQuestion() {
        const questionsList = document.getElementById('questionsList');
        const questionIndex = questionsList.children.length;
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-header">
                <h4>Question ${questionIndex + 1}</h4>
                <button type="button" class="delete-question" onclick="this.parentElement.parentElement.remove()">Delete</button>
            </div>
            <input type="text" placeholder="Enter your question..." class="form-input question-text-input" required>
            <div class="answers-list">
                <div class="answer-item">
                    <input type="radio" name="correct_${questionIndex}" value="0">
                    <input type="text" placeholder="Answer option 1..." class="form-input">
                    <label>Correct answer</label>
                </div>
                <div class="answer-item">
                    <input type="radio" name="correct_${questionIndex}" value="1">
                    <input type="text" placeholder="Answer option 2..." class="form-input">
                </div>
                <div class="answer-item">
                    <input type="radio" name="correct_${questionIndex}" value="2">
                    <input type="text" placeholder="Answer option 3..." class="form-input">
                </div>
                <div class="answer-item">
                    <input type="radio" name="correct_${questionIndex}" value="3">
                    <input type="text" placeholder="Answer option 4..." class="form-input">
                </div>
            </div>
        `;
        
        questionsList.appendChild(questionDiv);
    }

    saveQuiz() {
        const title = document.getElementById('quizTitle').value.trim();
        const description = document.getElementById('quizDescription').value.trim();
        
        if (!title) {
            alert('Please enter a quiz title.');
            return;
        }

        const questions = [];
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text-input').value.trim();
            const answerInputs = item.querySelectorAll('.answer-item input[type="text"]');
            const correctRadio = item.querySelector(`input[name="correct_${index}"]:checked`);
            
            if (!questionText) {
                alert(`Please enter text for question ${index + 1}.`);
                return;
            }

            const answers = Array.from(answerInputs).map(input => input.value.trim()).filter(text => text);
            
            if (answers.length < 2) {
                alert(`Question ${index + 1} needs at least 2 answer options.`);
                return;
            }

            if (!correctRadio) {
                alert(`Please select the correct answer for question ${index + 1}.`);
                return;
            }

            questions.push({
                question: questionText,
                answers: answers,
                correctAnswer: parseInt(correctRadio.value)
            });
        });

        if (questions.length === 0) return;

        const quiz = {
            id: Date.now().toString(),
            title: title,
            description: description,
            questions: questions,
            created: new Date().toISOString()
        };

        this.quizzes.push(quiz);
        localStorage.setItem('mindease-quizzes', JSON.stringify(this.quizzes));
        
        alert('Quiz saved successfully!');
        this.clearQuizForm();
        this.switchQuizTab('library');
    }

    clearQuizForm() {
        document.getElementById('quizTitle').value = '';
        document.getElementById('quizDescription').value = '';
        document.getElementById('questionsList').innerHTML = '';
        this.addQuestion();
    }

    loadQuizLibrary() {
        const quizList = document.getElementById('quizList');
        const practiceQuizList = document.getElementById('practiceQuizList');
        
        if (!quizList) return;

        const renderQuizzes = (container) => {
            container.innerHTML = '';
            
            if (this.quizzes.length === 0) {
                container.innerHTML = '<p>No quizzes created yet. Create your first quiz!</p>';
                return;
            }

            this.quizzes.forEach(quiz => {
                const quizItem = document.createElement('div');
                quizItem.className = 'quiz-item';
                quizItem.innerHTML = `
                    <h4>${quiz.title}</h4>
                    <p>${quiz.description || 'No description'}</p>
                    <p><strong>${quiz.questions.length}</strong> questions</p>
                    <p><small>Created: ${new Date(quiz.created).toLocaleDateString()}</small></p>
                    ${container === quizList ? `
                        <div style="margin-top: 1rem;">
                            <button class="btn-secondary" onclick="mindease.deleteQuiz('${quiz.id}')">Delete</button>
                        </div>
                    ` : ''}
                `;
                
                if (container === practiceQuizList) {
                    quizItem.addEventListener('click', () => this.startQuizPractice(quiz));
                }
                
                container.appendChild(quizItem);
            });
        };

        renderQuizzes(quizList);
        if (practiceQuizList) renderQuizzes(practiceQuizList);
    }

    deleteQuiz(quizId) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            this.quizzes = this.quizzes.filter(quiz => quiz.id !== quizId);
            localStorage.setItem('mindease-quizzes', JSON.stringify(this.quizzes));
            this.loadQuizLibrary();
        }
    }

    setupQuizPractice() {
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');
        const retakeBtn = document.getElementById('retakeQuiz');
        const backToLibraryBtn = document.getElementById('backToLibrary');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeQuiz());
        if (backToLibraryBtn) backToLibraryBtn.addEventListener('click', () => this.backToQuizLibrary());
    }

    startQuizPractice(quiz) {
        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(quiz.questions.length).fill(null);
        
        document.getElementById('quizSelector').classList.add('hidden');
        document.getElementById('quizPractice').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        
        document.getElementById('practiceQuizTitle').textContent = quiz.title;
        document.getElementById('totalQuestions').textContent = quiz.questions.length;
        
        this.showQuestion();
    }

    showQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const answerOptions = document.getElementById('answerOptions');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');

        currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        questionText.textContent = question.question;
        
        answerOptions.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option';
            optionDiv.textContent = answer;
            optionDiv.addEventListener('click', () => this.selectAnswer(index));
            
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionDiv.classList.add('selected');
            }
            
            answerOptions.appendChild(optionDiv);
        });

        // Update button states
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        nextBtn.classList.toggle('hidden', isLastQuestion);
        submitBtn.classList.toggle('hidden', !isLastQuestion);
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            option.classList.toggle('selected', index === answerIndex);
        });
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        }
    }

    submitQuiz() {
        const unansweredQuestions = this.userAnswers.map((answer, index) => 
            answer === null ? index + 1 : null
        ).filter(q => q !== null);

        if (unansweredQuestions.length > 0) {
            if (!confirm(`You have ${unansweredQuestions.length} unanswered questions. Submit anyway?`)) {
                return;
            }
        }

        this.showQuizResults();
    }

    showQuizResults() {
        let correctCount = 0;
        
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        const totalQuestions = this.currentQuiz.questions.length;
        const incorrectCount = totalQuestions - correctCount;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        document.getElementById('quizPractice').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
        
        document.getElementById('finalScore').textContent = percentage;
        document.getElementById('correctAnswers').textContent = correctCount;
        document.getElementById('incorrectAnswers').textContent = incorrectCount;
        document.getElementById('totalAnswered').textContent = totalQuestions;
    }

    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);
        
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('quizPractice').classList.remove('hidden');
        
        this.showQuestion();
    }

    backToQuizLibrary() {
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('quizPractice').classList.add('hidden');
        document.getElementById('quizSelector').classList.remove('hidden');
        
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
    }
    
    // AI Study Coach Feature
    setupStudyCoach() {
        const studyCoachButton = document.getElementById('studyCoachButton');
        if (studyCoachButton) {
            studyCoachButton.addEventListener('click', () => {
                this.showStudyCoachRecommendations();
            });
        }
    }
    
    showStudyCoachRecommendations() {
        const recommendations = this.generateStudyRecommendations();
        const container = document.getElementById('studyCoachRecommendations');
        
        if (container) {
            container.innerHTML = `
                <div class="study-coach-panel">
                    <h3><i class="fas fa-graduation-cap"></i> Your AI Study Coach</h3>
                    <div class="recommendations">
                        ${recommendations.map(rec => `
                            <div class="recommendation-card">
                                <div class="rec-icon"><i class="${rec.icon}"></i></div>
                                <div class="rec-content">
                                    <h4>${rec.title}</h4>
                                    <p>${rec.description}</p>
                                    ${rec.action ? `<button class="btn-secondary" onclick="${rec.action}">${rec.actionText}</button>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            container.classList.remove('hidden');
        }
    }
    
    generateStudyRecommendations() {
        const now = new Date();
        const timeOfDay = now.getHours();
        const progress = this.progressData;
        const recentStress = progress.stressLevels.slice(-3);
        const avgStress = recentStress.length > 0 ? recentStress.reduce((a, b) => a + b, 0) / recentStress.length : 2;
        
        let recommendations = [];
        
        // Time-based recommendations
        if (timeOfDay < 12) {
            recommendations.push({
                icon: 'fas fa-sun',
                title: 'Morning Study Boost',
                description: 'Morning is great for learning new concepts. Your brain is fresh and ready to absorb information. Consider tackling your most challenging topics now.',
                action: null
            });
        } else if (timeOfDay < 17) {
            recommendations.push({
                icon: 'fas fa-clock',
                title: 'Afternoon Review',
                description: 'Perfect time for reviewing and reinforcing what you learned this morning. Practice problems and flashcards work well now.',
                action: 'mindease.navigateToSection("quiz")',
                actionText: 'Create Practice Quiz'
            });
        } else {
            recommendations.push({
                icon: 'fas fa-moon',
                title: 'Evening Wind-Down',
                description: 'Light review and preparation for tomorrow. Avoid intense studying close to bedtime to protect your sleep quality.',
                action: 'mindease.navigateToSection("breathing")',
                actionText: 'Try Breathing Exercise'
            });
        }
        
        // Stress-based recommendations
        if (avgStress > 2.5) {
            recommendations.push({
                icon: 'fas fa-heart',
                title: 'Stress Management Priority',
                description: 'Your recent stress levels suggest you need more balance. Take breaks every 25-30 minutes, and don\'t forget to breathe deeply.',
                action: 'mindease.navigateToSection("breathing")',
                actionText: 'Start Breathing Exercise'
            });
        } else if (avgStress < 1.5) {
            recommendations.push({
                icon: 'fas fa-rocket',
                title: 'High Energy Mode',
                description: 'You\'re in a great mental state! This is perfect for tackling challenging material or learning new concepts.',
                action: null
            });
        }
        
        // Progress-based recommendations
        if (progress.sessionsThisWeek < 3) {
            recommendations.push({
                icon: 'fas fa-calendar-check',
                title: 'Consistency Boost',
                description: 'Regular study sessions lead to better retention. Try to use MindEase tools at least 3-4 times per week for optimal results.',
                action: null
            });
        }
        
        // Personalized technique recommendations
        const favoriteBreathing = this.getMostUsedBreathingTechnique();
        if (favoriteBreathing) {
            recommendations.push({
                icon: 'fas fa-lungs',
                title: 'Your Favorite Technique',
                description: `You\'ve found success with ${favoriteBreathing} breathing. Consider using it before important study sessions or tests.`,
                action: 'mindease.navigateToSection("breathing")',
                actionText: 'Practice Now'
            });
        }
        
        // General study tips
        recommendations.push({
            icon: 'fas fa-lightbulb',
            title: 'Study Tip of the Day',
            description: this.getRandomStudyTip(),
            action: null
        });
        
        return recommendations.slice(0, 4); // Limit to 4 recommendations
    }
    
    getMostUsedBreathingTechnique() {
        const techniques = this.progressData.breathingTechniques;
        let maxCount = 0;
        let favorite = null;
        
        for (const [technique, count] of Object.entries(techniques)) {
            if (count > maxCount) {
                maxCount = count;
                favorite = technique;
            }
        }
        
        return favorite;
    }
    
    getRandomStudyTip() {
        const tips = [
            "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
            "Teach concepts out loud to yourself or others - it strengthens understanding.",
            "Create visual mind maps to connect related ideas and improve memory.",
            "Study in different locations to strengthen memory associations.",
            "Take practice tests in conditions similar to your actual exam.",
            "Review material right before bed - your brain consolidates memories during sleep.",
            "Use active recall: test yourself frequently instead of just re-reading notes.",
            "Break complex topics into smaller, manageable chunks (chunking technique).",
            "Use spaced repetition: review material at increasing intervals over time.",
            "Connect new information to things you already know to improve retention."
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Progress Tracking Feature
    setupProgressTracking() {
        // Track daily activities
        this.recordDailyActivity();
        
        // Show progress dashboard if requested
        const progressButton = document.getElementById('progressButton');
        if (progressButton) {
            progressButton.addEventListener('click', () => {
                this.showProgressDashboard();
            });
        }
    }
    
    initializeProgressData() {
        const initialData = {
            startDate: new Date().toISOString(),
            stressLevels: [],
            sessionsThisWeek: 0,
            totalSessions: 0,
            breathingTechniques: {
                '4-7-8': 0,
                'box': 0,
                'calm': 0
            },
            chatInteractions: 0,
            quizzesTaken: 0,
            averageStressReduction: 0,
            streakDays: 0,
            lastActiveDate: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('mindease-progress', JSON.stringify(initialData));
        return initialData;
    }
    
    recordDailyActivity() {
        const today = new Date().toISOString().split('T')[0];
        
        if (this.progressData.lastActiveDate !== today) {
            // New day - reset daily counters and update streak
            const lastActive = new Date(this.progressData.lastActiveDate);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastActive) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                this.progressData.streakDays += 1;
            } else if (daysDiff > 1) {
                this.progressData.streakDays = 1; // Reset streak
            }
            
            this.progressData.lastActiveDate = today;
            this.progressData.sessionsThisWeek = 0; // Reset if it's a new week
        }
        
        this.progressData.totalSessions += 1;
        this.progressData.sessionsThisWeek += 1;
        this.saveProgressData();
    }
    
    recordStressLevel(level) {
        this.progressData.stressLevels.push(level);
        
        // Keep only last 30 stress level records
        if (this.progressData.stressLevels.length > 30) {
            this.progressData.stressLevels.shift();
        }
        
        this.calculateStressReduction();
        this.saveProgressData();
    }
    
    recordBreathingSession(technique) {
        if (this.progressData.breathingTechniques[technique] !== undefined) {
            this.progressData.breathingTechniques[technique] += 1;
        }
        this.saveProgressData();
    }
    
    recordChatInteraction() {
        this.progressData.chatInteractions += 1;
        this.saveProgressData();
    }
    
    recordQuizCompletion() {
        this.progressData.quizzesTaken += 1;
        this.saveProgressData();
    }
    
    calculateStressReduction() {
        const levels = this.progressData.stressLevels;
        if (levels.length < 2) return;
        
        let totalReduction = 0;
        let reductionCount = 0;
        
        for (let i = 1; i < levels.length; i++) {
            if (levels[i] < levels[i-1]) {
                totalReduction += (levels[i-1] - levels[i]);
                reductionCount++;
            }
        }
        
        this.progressData.averageStressReduction = reductionCount > 0 ? totalReduction / reductionCount : 0;
    }
    
    saveProgressData() {
        localStorage.setItem('mindease-progress', JSON.stringify(this.progressData));
    }
    
    showProgressDashboard() {
        const container = document.getElementById('progressDashboard');
        const progress = this.progressData;
        
        if (container) {
            container.innerHTML = `
                <div class="progress-dashboard">
                    <h3><i class="fas fa-chart-line"></i> Your Mental Health Journey</h3>
                    
                    <div class="progress-stats">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-fire"></i></div>
                            <div class="stat-content">
                                <h4>${progress.streakDays}</h4>
                                <p>Day Streak</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-calendar-week"></i></div>
                            <div class="stat-content">
                                <h4>${progress.sessionsThisWeek}</h4>
                                <p>Sessions This Week</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-comments"></i></div>
                            <div class="stat-content">
                                <h4>${progress.chatInteractions}</h4>
                                <p>Chat Conversations</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-brain"></i></div>
                            <div class="stat-content">
                                <h4>${progress.quizzesTaken}</h4>
                                <p>Quizzes Completed</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-charts">
                        <div class="chart-section">
                            <h4>Recent Stress Levels</h4>
                            <div class="stress-trend">
                                ${this.generateStressTrendChart()}
                            </div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Favorite Breathing Techniques</h4>
                            <div class="breathing-stats">
                                ${Object.entries(progress.breathingTechniques).map(([technique, count]) => `
                                    <div class="technique-stat">
                                        <span>${technique}</span>
                                        <div class="stat-bar">
                                            <div class="stat-fill" style="width: ${(count / Math.max(...Object.values(progress.breathingTechniques)) * 100) || 0}%"></div>
                                        </div>
                                        <span>${count}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    ${progress.averageStressReduction > 0 ? `
                        <div class="achievement">
                            <i class="fas fa-trophy"></i>
                            <p>Great progress! You've reduced your stress levels by an average of ${progress.averageStressReduction.toFixed(1)} points per session.</p>
                        </div>
                    ` : ''}
                </div>
            `;
            container.classList.remove('hidden');
        }
    }
    
    generateStressTrendChart() {
        const levels = this.progressData.stressLevels.slice(-10); // Last 10 readings
        if (levels.length === 0) return '<p>No stress level data yet. Take a stress assessment to see your progress!</p>';
        
        const maxLevel = 4; // Maximum stress level
        return levels.map((level, index) => `
            <div class="stress-point" style="height: ${(level / maxLevel) * 100}%; background-color: ${this.getStressColor(level)};" title="Stress Level: ${level}/4"></div>
        `).join('');
    }
    
    getStressColor(level) {
        if (level <= 1.5) return '#10b981'; // Green
        if (level <= 2.5) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    }
}

// Initialize the application
const mindease = new MindEaseApp();

// Make certain methods globally accessible for HTML event handlers
window.mindease = mindease;