

export function getYYMMDDHH() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    return `${year}${month}${day}${hour}`;
}

export function timeDifference(yymmddhh : string) {
    // Parse YYMMDDHH to a Date object
    const year = parseInt(yymmddhh.substring(0, 2), 10) + 2000; // Assuming YY is after 2000
    const month = parseInt(yymmddhh.substring(2, 4), 10) - 1; // Month is 0-indexed in JavaScript
    const day = parseInt(yymmddhh.substring(4, 6), 10);
    const hour = parseInt(yymmddhh.substring(6, 8), 10);
    const givenDate = new Date(year, month, day, hour);

    // Get current time
    const now = new Date();

    // Calculate difference in years, months, days, and hours
    let years = now.getFullYear() - givenDate.getFullYear();
    let months = now.getMonth() - givenDate.getMonth();
    let days = now.getDate() - givenDate.getDate();
    let hours = now.getHours() - givenDate.getHours();

    // Adjust for negative differences
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        days += new Date(year, month + 1, 0).getDate(); // Days in month
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    // Determine the most significant difference
    if (years > 0) return `${years} years ago`;
    if (months > 0) return `${months} months ago`;
    if (days > 0) return `${days} days ago`;
    return `${hours} hours ago`;
}