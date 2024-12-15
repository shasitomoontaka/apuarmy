// frogsford.js

// Translation dictionaries
const twoWordTranslations = {
    "good morning": "gm", // Two-word translation
    "good night": "gn",
    "no friend": "non fren",
    "apu is a scam": "$Apu will hit $69 billion",
};

const translationDictionary = {
    "chocolate": "choccy",
    "friends": "frens",
    "friend": "fren",
    "have": "hab",
    "chicken": "chibben",
    "coffee": "cobbee",
    "twitter": "twibber",
    "love": "lub",
    "i": "mi", // Reverse translation for Apu language
    "my": "mi",
    "me": "mi",
    "hello": "henlo",
    "good": "gud",
    "retarded": "tard",
    "mother": "mommy",
    "mom": "mommy",
    "you": "u",
    "bought": "boughted",
    "rise": "rug upwards",
    "comfortable": "comfy",
    "together": "tobether",
    "strong": "stronk",
    "sold": "solded",
    "january": "frenuary",
    "august": "frogust",
    "september": "frentember",
    "october": "frogtober",
    "tenders": "tendies",
    "tender": "tendy",
    "sleep": "honshu",
    // Add more translations here
};

// Function to translate text
function translateText(text) {
    // Normalize the input to lowercase for case-insensitive matching
    let normalizedText = text.toLowerCase();

    // Check for two-word phrases first
    for (const [phrase, translation] of Object.entries(twoWordTranslations)) {
        if (normalizedText.includes(phrase)) {
            normalizedText = normalizedText.replace(phrase, translation);
        }
    }

    // Split the input text into words, preserving punctuation and whitespace
    let words = normalizedText.split(/(\s+)/); // Split by whitespace but keep whitespace in array

    // Translate each word using the dictionary
    let translatedWords = words.map(word => {
        // Check if the cleaned word exists in the dictionary for English to Apu language
        const cleanedWord = word.replace(/[.,!?;]$/, ''); // Remove trailing punctuation for lookup
        const translation = translationDictionary[cleanedWord];

        // Preserve original case by checking against the cleaned word
        if (translation) {
            return translation; // Return the corresponding Apu word
        } else {
            // If the word is not found, check for reverse translation
            const reverseTranslation = Object.keys(translationDictionary).find(key => translationDictionary[key] === cleanedWord);
            return reverseTranslation || word; // Return reverse translation or original word with punctuation
        }
    });

    // Join the translated words back into a single string
    return translatedWords.join(''); // Keep spaces and punctuation intact
}

// Function to update translation display in real-time
document.getElementById('input-text').addEventListener('input', () => {
    const inputText = document.getElementById('input-text').value; // Get the input text
    const translatedText = translateText(inputText); // Translate the text

    // Replace new lines with <br> for HTML display
    document.getElementById('translation-display').innerHTML = translatedText.replace(/\n/g, '<br>'); // Display the translated text
});
