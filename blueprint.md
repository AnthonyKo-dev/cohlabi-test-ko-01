# Lotto Number Generator

## Overview

This is a simple, visually appealing web application to generate random lottery numbers. The application provides a clean, user-friendly interface for generating and displaying a set of 6 unique numbers between 1 and 45.

## Features & Design

*   **Responsive Design:** The layout is fully responsive and works on both desktop and mobile devices.
*   **Modern Aesthetics:** The design incorporates a clean and modern look with a subtle background texture, vibrant colors, and smooth animations.
*   **Interactive Elements:**
    *   A prominent "Generate Numbers" button with a hover effect.
    *   Generated numbers are displayed in styled "lotto balls."
*   **Color-Coded Numbers:** Each number ball is color-coded based on its value range to enhance visual distinction:
    *   1-10: Yellow
    *   11-20: Blue
    *   21-30: Red
    *   31-40: Gray
    *   41-45: Green
*   **Dynamic Generation:** The lottery numbers are generated dynamically on the client-side using JavaScript, ensuring a unique set of numbers with each click.

## Current Plan

*   **HTML Structure (`index.html`):** Set up the main container, title, button, and a placeholder for the lottery numbers.
*   **CSS Styling (`style.css`):**
    *   Implement the core layout, background, and typography.
    *   Style the main card, the "Generate" button, and the lotto balls.
    *   Add color-coding classes for the different number ranges.
*   **JavaScript Logic (`main.js`):**
    *   Create a function to generate 6 unique random numbers.
    *   Add an event listener to the button to trigger the number generation and display.
    *   Implement the logic to dynamically create and color the lotto ball elements.
