//const { post } = require("../../routes/auth");

let questionCount = 0;

function addQuestion() {
  questionCount++;

  const questionsContainer = document.getElementById('questions-container');

  const questionContainer = document.createElement('div');
  questionContainer.classList.add('question');

  const questionLabel = document.createElement('label');
  questionLabel.textContent = `Question ${questionCount}:`;
  questionLabel.className = 'questions';

  const questionInput = document.createElement('input');
  questionInput.className = 'question1';
  questionInput.setAttribute('type', 'text');
  questionInput.name = 'Question_value';
  document.createElement('br');

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'removeBtn';
  removeButton.setAttribute('type', 'button');
  removeButton.addEventListener('click', () => {
    questionContainer.remove();
    updatePreview();
  });

  questionContainer.appendChild(questionLabel);
  questionContainer.appendChild(questionInput);
  questionContainer.appendChild(removeButton);

  const questionTypeSelect = document.getElementById('question-type');
  const questionType = questionTypeSelect.value;

  // questionContainer.innerHTML += `<input type="hidden" name="question_type[${questionCount}]" value="${questionType}">`;

  if (questionType === 'radio' || questionType === 'checkbox') {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options');

    const addOptionButton = document.createElement('button');
    addOptionButton.textContent = 'Add Option';
    addOptionButton.className = 'addOption';
    addOptionButton.setAttribute('type', 'button');
    addOptionButton.addEventListener('click', () => {
      createOption(optionsContainer, questionCount);
      updatePreview();
    });

    questionContainer.appendChild(optionsContainer);
    questionContainer.appendChild(addOptionButton);
  }

  questionsContainer.appendChild(questionContainer);
  updatePreview();
}

function createOption(optionsContainer, questionCount) {
  const optionContainer = document.createElement('div');
  optionContainer.classList.add('option');

  const optionInput = document.createElement('input');
  optionInput.className = 'option1';
  optionInput.setAttribute('type', 'text');
  optionInput.name = 'options';

  const removeOptionButton = document.createElement('button');
  removeOptionButton.textContent = 'Remove';
  removeOptionButton.setAttribute('type', 'button');
  removeOptionButton.addEventListener('click', () => {
    optionContainer.remove();
    updatePreview();
  });

  optionContainer.appendChild(optionInput);
  optionContainer.appendChild(removeOptionButton);

  optionsContainer.appendChild(optionContainer);
  updatePreview();
}

function updatePreview() {
  const previewContainer = document.getElementById('preview-container');
  const questionsContainer = document.getElementById('questions-container');

  previewContainer.innerHTML = '';

  for (let i = 0; i < questionsContainer.children.length; i++) {
    const question = questionsContainer.children[i];
    const questionText = question.querySelector('input[type="text"]').value;
    const questionType = question.querySelector('input[type="hidden"]').value;
    const options = Array.from(question.querySelectorAll('.option input[type="text"]')).map(option => option.value);

    const questionPreview = document.createElement('div');
    questionPreview.classList.add('question-preview');

    const questionTextPreview = document.createElement('p');
    questionTextPreview.textContent = `Question ${i + 1}: ${questionText}`;

    const questionTypePreview = document.createElement('p');
    questionTypePreview.textContent = `Question_Type: ${questionType}`;

    questionPreview.appendChild(questionTextPreview);
    questionPreview.appendChild(questionTypePreview);

    if (questionType === 'radio' || questionType === 'checkbox') {
      const optionsPreview = document.createElement('div');
      optionsPreview.classList.add('options-preview');

      for (let j = 0; j < options.length; j++) {
        const optionPreview = document.createElement('div');
        optionPreview.classList.add('option-preview');
        optionPreview.className = 'optionPrev';

        const input = document.createElement('input');
        input.setAttribute('type', questionType);
        input.className = 'optionName';

        const label = document.createElement('label');
        label.textContent = options[j];
        label.insertBefore(input, label.firstChild);

        optionPreview.appendChild(label);
        optionsPreview.appendChild(optionPreview);
      }

      questionPreview.appendChild(optionsPreview);
    }

    previewContainer.appendChild(questionPreview);
  }
}

/*function saveDraft() {
  const questionForm = document.getElementById('question-form');
  questionForm.action = ;
  questionForm.submit();
}*/