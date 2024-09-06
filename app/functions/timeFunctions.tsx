import exp from "constants";


export function timeDifference(date: Date) {
    // Get current time
    const now = new Date();

    // Calculate difference in years, months, days, hours, minutes, and seconds
    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();
    let days = now.getDate() - date.getDate();
    let hours = now.getHours() - date.getHours();
    let minutes = now.getMinutes() - date.getMinutes();
    let seconds = now.getSeconds() - date.getSeconds();

    // Adjust for negative differences
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        days += new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Days in month
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    // Determine the most significant difference
    if (years > 0) return `${years} year${years == 1 ? "" : "s"} ago`;
    if (months > 0) return `${months} month${months == 1 ? "" : "s"} ago`;
    if (days > 0) return `${days} day${days == 1 ? "" : "s"} ago`;
    if (hours > 0) return `${hours} hour${hours == 1 ? "" : "s"} ago`;
    if (minutes > 0) return `${minutes} minute${minutes == 1 ? "" : "s"} ago`;
    return `${seconds} seconds ago`;
}


export function IDstringTodate(id: string) {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
}
