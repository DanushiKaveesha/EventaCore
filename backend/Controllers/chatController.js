// Simple Rule-Based Chatbot Controller (No API Key required)

const processChatMessage = (req, res) => {
    try {
        const userMessage = req.body.message || "";
        const lowerMsg = userMessage.toLowerCase();

        // Fallback response
        let responseText = "I'm not quite sure. Can you rephrase? I can help you with events, clubs, ticketing, and bookings!";

        // Rules & Intent Matching
        
        // 1. Greetings
        if (lowerMsg.match(/\b(hi|hello|hey|greetings|morning|afternoon)\b/i)) {
            responseText = "Hello! I'm the Campus Assistant Bot. I can help you find events, join clubs, or check availability. What do you need help with?";
        }
        
        // 2. Events Integration
        else if (lowerMsg.match(/\b(event|events|festival|symposium|show|concert)\b/i)) {
            if (lowerMsg.match(/\b(create|add|new|host)\b/i)) {
                responseText = "To host a new event, head over to the Admin Dashboard and navigate to the 'Create Event' section. You'll need to specify the date and venue!";
            } else {
                responseText = "We have several amazing events coming up! Check out the 'Events' tab to see the calendar and discover what's happening on campus.";
            }
        }
        
        // 3. Tickets & Booking
        else if (lowerMsg.match(/\b(ticket|tickets|book|booking|buy|payment|pay|vip)\b/i)) {
            if (lowerMsg.match(/\b(fail|failed|error|problem)\b/i)) {
                responseText = "If your payment failed, try checking your internet connection or use a different card. Your selected seats will be held for 15 minutes.";
            } else {
                responseText = "You can easily book tickets directly from an event's page. We offer standard and VIP seating options depending on the venue. Payments are processed securely!";
            }
        }

        // 4. Clubs & Membership
        else if (lowerMsg.match(/\b(club|clubs|join|membership|member)\b/i)) {
            responseText = "Looking to get involved? You can explore all official campus clubs in the 'Clubs' directory. Click 'Join' on any club page to register your interest!";
        }

        // 5. Calendar / Facilities
        else if (lowerMsg.match(/\b(calendar|schedule|hall|auditorium|facility|free|available)\b/i)) {
            responseText = "You can check auditorium and facility availability on our interactive Calendar view. Green slots mean the venue is free to book!";
        }

        // 6. Anti-Gravity Easter Egg
        else if (lowerMsg.match(/\b(gravity|anti-gravity|bot detector|who are you)\b/i)) {
            responseText = "🚀 I am a custom built ANTI-GRAVITY CHATBOT! I float above API limitations using simple but effective logic.";
        }

        // Artificial delay to feel more natural (e.g. 500ms - 1000ms delay)
        setTimeout(() => {
            return res.status(200).json({
                success: true,
                reply: responseText
            });
        }, 800);

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ success: false, message: "Chatbot encountered an error." });
    }
};

module.exports = {
    processChatMessage
};
