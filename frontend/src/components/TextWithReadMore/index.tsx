import { useState } from "react";
import colors from "../../constants/colors";

interface TextWithReadMoreProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  limit: number;
}

export default function TextWithReadMore({
  value,
  limit,
  ...props
}: TextWithReadMoreProps) {
  const originalText = value;
  const [visibleText, setVisibleText] = useState(value.slice(0, limit));
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setVisibleText(showMore ? originalText.slice(0, limit) : originalText);
    setShowMore(!showMore);
  };

  return (
    <div {...props}>
      {value.length > limit && !showMore ? `${visibleText}...` : visibleText}
      {value.length > limit && (
        <button
          onClick={handleShowMore}
          style={{
            color: colors.secondary,
          }}
          className="ml-1 cursor-pointer hover:underline"
        >
          {showMore ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
