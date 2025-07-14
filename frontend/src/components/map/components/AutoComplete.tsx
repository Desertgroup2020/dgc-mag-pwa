import React, { useState, useRef, useEffect, ReactNode } from "react";

type CustomAutocompleteProps = {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  googleAutocomplete: google.maps.places.Autocomplete | null;
  onPlaceChanged?: () => void;
  children: ReactNode;
};

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  suggestions,
  onSelectSuggestion,
  googleAutocomplete,
  onPlaceChanged,
  children,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Apply the Google autocomplete if available
    if (googleAutocomplete && inputRef.current) {
      googleAutocomplete.addListener("place_changed", () => {
        if (onPlaceChanged) onPlaceChanged();
      });
    }
  }, [googleAutocomplete, onPlaceChanged]);

  useEffect(() => {
    // Filter custom suggestions based on input value
    if (inputValue) {
      const newFilteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(newFilteredSuggestions);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [inputValue, suggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setActiveIndex(-1);
  };

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelectSuggestion(suggestion);
  };

  return (
    <div className="autocomplete">
      {/* Render the children input and forward the ref */}
      {React.cloneElement(children as React.ReactElement, {
        ref: inputRef,
        value: inputValue,
        onChange: handleInputChange,
      })}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="dropdown">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`dropdown-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomAutocomplete;
