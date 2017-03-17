# Code Style Guide

**TypeScript/JavaScript Rules:**
* Always use 'single quotes' on strings, save "double quotes" for the second (inner) layer. 
  * Most people follow this convention, including Google. Note that this makes it easier to inject HTML:
     * Eg. var msg = 'This is some HTML';
* Constants are UPPERCASE_WITH_UNDERSCORES
* Class names are PascalCase
* Function names are camelCased
* Method names are camelCased
* Variable names are camelCased
* Enum Names are PascalCased
* Function names are camelCased
* Optional function/method arguments start with opt_
* Filenames are all-lower-case-with-hyphens.jsp
  * Some OS filesystems are not case sensitive, so this avoids errors
  * This is recommended by Google, and popular convention

**Notes:**
* Style guide is based off of common convention and suggested styling practices
