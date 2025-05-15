// Helper function to format time from "HH:MM" to "h:MM AM/PM"
const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minutes} ${ampm}`;
}

export default formatTime;