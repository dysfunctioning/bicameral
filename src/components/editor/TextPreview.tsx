
interface TextPreviewProps {
  text: string;
  paragraphAlignments: Record<number, string>;
  fontSizeClass: string;
  fontFamilyClass: string;
}

export default function TextPreview({ 
  text, 
  paragraphAlignments, 
  fontSizeClass, 
  fontFamilyClass 
}: TextPreviewProps) {
  if (!text) return null;
  
  return (
    <div className="mt-4 p-2 border rounded-md">
      <h3 className="text-sm font-semibold mb-2">Preview:</h3>
      <div className={`${fontSizeClass} ${fontFamilyClass}`}>
        {text.split('\n').map((paragraph, index) => {
          const alignment = paragraphAlignments[index] || 'left';
          return (
            <div 
              key={index} 
              className={`mb-2`}
              style={{ textAlign: alignment as any }}
            >
              {paragraph || <br />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
