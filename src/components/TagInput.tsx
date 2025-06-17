import React, { useState } from "react";
import { toast } from "react-toastify";

const TagInput = ({
  tags,
  setTags,
  placeholder = "Enter tag and press Enter",
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();

      if (tags.tags.length >= 5) {
        toast.warn("You can only add up to 5 tags");
        return;
      }

      const newTag = input.trim();
      if (!tags.tags.includes(newTag)) {
        setTags({ ...tags, tags: [...tags.tags, newTag] });
      }

      setInput("");
    } else if (
      e.key === "Backspace" &&
      !input &&
      tags.tags.length > 0 &&
      tags.tags[tags.tags.length - 1]
    ) {
      setTags({
        ...tags,
        tags: tags.tags.slice(0, tags.tags.length - 1),
      });
    }
  };

  const removeTag = (indexToRemove) => {
    setTags({
      ...tags,
      tags: tags.tags.filter((_, i) => i !== indexToRemove),
    });
  };

  return (
    <div className="border border-gray-300 rounded-md px-2 py-1 flex flex-wrap items-center min-h-[40px] max-h-[70px] overflow-y-scroll">
      {tags.tags.map((tag, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm mr-1 mb-1 flex items-center"
        >
          {tag}
          <button
            onClick={() => removeTag(index)}
            className="ml-2 cursor-pointer text-blue-500 hover:text-red-500"
          >
            ×
          </button>
        </span>
      ))}
      {tags.tags.length < 5 && (
        <input
          type="text"
          className="flex-1 outline-none py-1 px-2 text-sm"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default TagInput;
