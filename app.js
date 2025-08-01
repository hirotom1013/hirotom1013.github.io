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
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupChatbot();
        this.setupStressTest();
        this.setupBreathingExercise();
        this.setupQuizMaker();
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
        
        // Mental health supportive responses
        const responses = {
            stress: [
                "I understand you're feeling stressed. Remember that stress before tests is completely normal. Would you like to try a breathing exercise?",
                "Stress can feel overwhelming, but you have the strength to manage it. Let's break down what's worrying you most.",
                "It's okay to feel stressed about upcoming tests. You've prepared, and that shows your dedication. Take things one step at a time."
            ],
            anxiety: [
                "Anxiety before tests is very common. You're not alone in feeling this way. Remember to focus on what you can control.",
                "I hear that you're feeling anxious. Try to remember that this feeling will pass. You've overcome challenges before.",
                "Anxiety can make everything feel bigger than it is. Let's focus on some grounding techniques to help you feel more centered."
            ],
            overwhelmed: [
                "Feeling overwhelmed is a sign that you care about doing well. Let's break down your tasks into smaller, manageable pieces.",
                "When everything feels like too much, remember that you only need to focus on one thing at a time. What's the most important task right now?",
                "It's completely understandable to feel overwhelmed. You're handling a lot. Be kind to yourself and take breaks when you need them."
            ],
            confident: [
                "That's wonderful to hear! Confidence is a great foundation for success. Keep that positive energy going.",
                "I'm so glad you're feeling confident! Remember this feeling and carry it with you into your test.",
                "Your confidence shows that you believe in yourself, and that's half the battle. You've got this!"
            ],
            tired: [
                "Rest is just as important as studying. Make sure you're getting enough sleep before your test.",
                "Feeling tired can make everything harder. Have you been taking breaks during your study sessions?",
                "Your brain needs rest to perform at its best. Consider taking a short break or doing a breathing exercise."
            ]
        };

        // Check for keywords and respond appropriately
        for (const [keyword, responseArray] of Object.entries(responses)) {
            if (message.includes(keyword)) {
                return responseArray[Math.floor(Math.random() * responseArray.length)];
            }
        }

        // General supportive responses
        const generalResponses = [
            "Thank you for sharing that with me. How are you feeling about your upcoming tests?",
            "I'm here to support you through this. What's one thing that would help you feel more prepared?",
            "Remember that your worth isn't determined by test scores. You're doing your best, and that's what matters.",
            "It sounds like you're working hard. What strategies have been most helpful for you so far?",
            "Every step you take in preparation is progress. How can I help you feel more confident today?",
            "I believe in your ability to handle whatever comes your way. What's your biggest concern right now?",
            "You've made it through 100% of your difficult days so far. That's a pretty good track record!"
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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
}

// Initialize the application
const mindease = new MindEaseApp();

// Make certain methods globally accessible for HTML event handlers
window.mindease = mindease;