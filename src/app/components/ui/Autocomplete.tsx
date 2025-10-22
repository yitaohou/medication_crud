'use client';

import { useState, useEffect, useRef } from 'react';

type AutocompleteOption = {
    label: string;
    sublabel?: string;
    dnc?: string;
};

type AutocompleteProps = {
    value: string;
    onChange: (value: string, dnc?: string) => void;
    onSearch: (query: string) => Promise<AutocompleteOption[]>;
    placeholder?: string;
    required?: boolean;
    className?: string;
    debounceMs?: number;
};

export default function Autocomplete({
    value,
    onChange,
    onSearch,
    placeholder = 'Search...',
    required = false,
    className = '',
    debounceMs = 300,
}: AutocompleteProps) {
    const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (inputValue: string) => {
        onChange(inputValue, undefined);
        setHighlightedIndex(-1);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(async () => {
            if (inputValue.length >= 2) {
                setIsLoading(true);
                const results = await onSearch(inputValue);
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setIsLoading(false);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, debounceMs);
    };

    const handleSelect = (option: AutocompleteOption) => {
        onChange(option.label, option.dnc);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelect(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setIsOpen(true);
                    }
                }}
                placeholder={placeholder}
                required={required}
                className={className}
                autoComplete="off"
            />

            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                                index === highlightedIndex ? 'bg-blue-100' : ''
                            }`}
                        >
                            <div className="font-medium text-gray-800">{option.label}</div>
                            {option.sublabel && (
                                <div className="text-xs text-gray-500">{option.sublabel}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}