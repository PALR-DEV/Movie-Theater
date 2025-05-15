const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

    return {
        weekday: date.toLocaleString('en-US', { weekday: 'short' }),
        month: date.toLocaleString('en-US', { month: 'short' }),
        day: date.getDate(),
    }
}

export default formatDate;