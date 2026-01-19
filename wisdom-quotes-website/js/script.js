// Simple script for future enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Log page load for analytics (you can add Google Analytics or similar here)
    console.log('Wisdom Without Borders - Page Loaded');

    // Smooth scroll behavior (if you add navigation links later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Optional: Add a simple visitor counter or tracking
    // You can integrate with your backend or analytics service here
});

// Example function for future quote rotation feature
function rotateQuotes() {
    // This can be expanded to show different quotes
    // Example structure for when you want to add more quotes
    const quotes = [
        {
            text: "Essere o non essere, questo è il problema.",
            author: "Shakespeare's timeless question, as spoken in Italy"
        }
        // Add more quotes here in the future
    ];

    return quotes;
}