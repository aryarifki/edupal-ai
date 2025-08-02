import Tesseract from 'tesseract.js';

const processOCR = async () => {
  if (!file) return;

  setIsProcessing(true);
  setError('');

  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          // Update progress if needed
        }
      }
    });
    
    const extractedText = result.data.text;
    setExtractedText(extractedText);
    onTextExtracted(extractedText);
  } catch (err) {
    setError('Failed to extract text from the image. Please try again.');
    console.error('OCR Error:', err);
  } finally {
    setIsProcessing(false);
  }
};
