/**
 * Checks if a movie screening time is too close to the current time to allow booking
 * 
 * @param {string} time - The screening time in 24-hour format (HH:MM)
 * @param {string} selectedDate - The selected date in ISO format (YYYY-MM-DD)
 * @param {number} thresholdMinutes - Minimum minutes required before showtime (default: 30)
 * @returns {boolean} - Returns true if the screening is too soon to book
 */
export default function isTimeTooSoon(time, selectedDate, thresholdMinutes = 30) {
    // Get current date and time
    const now = new Date();

    

    // Parse hours and minutes from the screening time
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create a Date object for the screening time
    const screeningTime = new Date(selectedDate);
    screeningTime.setHours(hours);
    screeningTime.setMinutes(minutes);
    screeningTime.setSeconds(0);


    // Calculate the difference in minutes between screening time and current time
    // Dividing by (1000 * 60) converts milliseconds to minutes:
    // - 1000 converts milliseconds to seconds
    // - 60 converts seconds to minutes
    const timeDifference = (screeningTime - now) / (1000 * 60);

    return timeDifference < thresholdMinutes;
}