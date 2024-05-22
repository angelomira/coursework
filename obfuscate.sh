#!/bin/bash

# Check if javascript-obfuscator is installed
if ! command -v javascript-obfuscator &> /dev/null
then
    echo "javascript-obfuscator could not be found. Please install it first."
    exit 1
fi

# Function to obfuscate JS files
obfuscate_js_files() {
    find . -type f -name "*.js" ! -path "./node_modules/*" ! -path "./.git/*" ! -path "./.github/*" | while read -r file; do
        echo "Obfuscating $file"
        javascript-obfuscator "$file" --compact true --self-defending false -o "${file}.obfuscated"
        mv "${file}.obfuscated" "$file"
    done
}

# Run the function
obfuscate_js_files

echo "All JavaScript files have been obfuscated."
