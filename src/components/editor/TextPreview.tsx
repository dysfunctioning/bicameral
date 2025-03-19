
import { fontSizeClasses } from "./editorUtils";

// Define TextAlign type to match CSS text-align property
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TextPreviewProps {
  text: string;
  paragraphAlignments: Record<number, string>;
  paragraphFontSizes: Record<number, string>;
  fontSizeClass: string;
  fontFamilyClass: string;
}

export default function TextPreview({ 
  text, 
  paragraphAlignments,
  paragraphFontSizes, 
  fontSizeClass, 
  fontFamilyClass 
}: TextPreviewProps) {
  const paragraphs = text.split('\n');

  return (
    <div className={`flex-1 p-4 bg-gray-50 border-l overflow-auto ${fontFamilyClass}`}>
      <h3 className="text-sm font-semibold text-gray-500 mb-2">Preview</h3>
      <div className="prose prose-sm max-w-none">
        {paragraphs.map((paragraph, index) => {
          // Get font size for this paragraph, or use the default
          const paragraphFontSize = paragraphFontSizes[index] || 
                                  fontSizeClass.replace('text-', '');
          
          const paragraphFontSizeClass = fontSizeClasses[paragraphFontSize as keyof typeof fontSizeClasses] || fontSizeClass;
          
          // Convert the alignment to a proper TextAlign type
          const alignment = paragraphAlignments[index] || 'left';
          const textAlign = (alignment as TextAlign);
          
          return (
            <p
              key={index}
              className={paragraphFontSizeClass}
              style={{ 
                textAlign: textAlign,
                marginBottom: '0.5em'
              }}
            >
              {paragraph || <br />}
            </p>
          );
        })}
      </div>
    </div>
  );
}
